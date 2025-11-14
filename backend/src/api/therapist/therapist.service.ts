import { BookingStatus, LeaveStatus } from '@prisma/client';
import { z } from 'zod';
import { sendNotification, sendNotificationBookingCancelled } from '../../services/notification.service';
import type { requestLeaveSchema, createTimeSlotsSchema } from './therapist.validation';
import { PrismaClient, Role, User, TimeSlot } from '@prisma/client';
import prisma from '../../utils/prisma';
type RequestLeaveInput = z.infer<typeof requestLeaveSchema>['body'];
type CreateTimeSlotsInput = z.infer<typeof createTimeSlotsSchema>['body'];
type GetSlotsInput = { date: string };


export const requestLeave = async (therapistId: string, input: RequestLeaveInput) => {
  const therapist = await prisma.therapistProfile.findUnique({ where: { id: therapistId }, include: { user: true } });
  if (!therapist) throw new Error('Therapist not found.');
  if (therapist.leavesRemainingThisMonth <= 0) throw new Error('No leaves remaining.');

  const leaveDate = new Date(input.date);
  const startOfDay = new Date(leaveDate.setUTCHours(0, 0, 0, 0));

  // Create a pending leave request; admin will approve/reject later
  await prisma.$transaction(async (tx) => {
    await tx.therapistLeave.create({ data: { therapistId, date: startOfDay, type: input.type, reason: input.reason, status: LeaveStatus.PENDING } });
  });
}

  // EMAIL FUNCTIONALITY TEMPORARILY DISABLED - COMMENTED OUT FOR FUTURE USE
  // Notify all admins via notification/email
  // const admins = await prisma.user.findMany({ where: { role: 'ADMIN' } });
  // await Promise.all(admins.map((admin) => sendNotification({
  //   userId: admin.id,
  //   message: `Leave request pending approval: ${therapist.name} on ${startOfDay.toDateString()} (${input.type}).`,
  //   sendAt: new Date()
  // })));

  // Acknowledge therapist
  // await sendNotification({
  //   userId: therapist.userId,
  //   message: `Your leave request for ${startOfDay.toDateString()} has been submitted for admin approval.`,
  //   sendAt: new Date()
  // });

//   return { message: 'Leave request submitted for approval.' };
// };

// export const getMySlotsForDate = async (therapistId: string, input: GetSlotsInput) => {
//   const { date } = input;
//   const dayStart = new Date(`${date}T00:00:00.000Z`);
//   const dayEnd = new Date(`${date}T23:59:59.999Z`);
//   console.log('[service.getMySlotsForDate] computed range', { dayStart: dayStart.toISOString(), dayEnd: dayEnd.toISOString() });
//   return prisma.timeSlot.findMany({
//     where: {
//       therapistId,
//       startTime: { gte: dayStart, lte: dayEnd },
//       // Return all slots for the date, including inactive/unbooked so therapist can activate them
//     },
//     orderBy: { startTime: 'asc' },
//   });
// };

// export const hasActiveSlots = async (therapistId: string) => {
//   const therapist = await prisma.therapistProfile.findUnique({
//     where: { id: therapistId },
//     select: { availableSlotTimes: true },
//   });
//   return therapist && Array.isArray(therapist.availableSlotTimes) && therapist.availableSlotTimes.length > 0;
// };

// export const setAvailableSlotTimes = async (therapistId: string, slotTimes: string[]) => {
//   const therapist = await prisma.therapistProfile.findUnique({ where: { id: therapistId } });
//   if (!therapist) throw new Error('Therapist not found');
  
//   const maxSlotsPerDay = therapist.maxSlotsPerDay ?? 8;
//   if (slotTimes.length > maxSlotsPerDay) {
//     throw new Error(`You can set at most ${maxSlotsPerDay} available time slots.`);
//   }
  
//   if (slotTimes.length === 0) {
//     throw new Error('You must select at least one time slot.');
//   }
  
//   // Validate time format (HH:MM)
//   const timeRegex = /^([01][0-9]|2[0-3]):[0-5][0-9]$/;
//   for (const time of slotTimes) {
//     if (!timeRegex.test(time)) {
//       throw new Error(`Invalid time format: ${time}. Expected format: HH:MM`);
//     }
//   }
  
//   await prisma.therapistProfile.update({
//     where: { id: therapistId },
//     data: { availableSlotTimes: slotTimes },
//   });
  
//   return { message: 'Available time slots updated successfully' };
// };


import { addDays, addMinutes, parse, startOfDay } from "date-fns";
import { fromZonedTime } from "date-fns-tz";
import { TherapistProfile } from "@prisma/client";

const SLOT_GENERATION_DAYS_AHEAD = 60;
const REQUIRED_SLOTS_COUNT = 8;
const SLOT_DURATION_MINUTES = 60;

export const getTherapistProfile = async (userId: string) => {
  return prisma.therapistProfile.findUnique({ where: { userId } });
};

export const hasActiveSlots = async (therapistId: string) => {
  const profile = await prisma.therapistProfile.findUnique({
    where: { id: therapistId },
    select: { selectedSlots: true }
  });

  return (profile?.selectedSlots?.length ?? 0) > 0;
};

export const setAvailableSlotTimes = async (therapistId: string, slotTimes: string[]) => {
  if (slotTimes.length !== REQUIRED_SLOTS_COUNT)
    throw new Error(`You must select exactly ${REQUIRED_SLOTS_COUNT} slots.`);

  const regex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
  slotTimes.forEach(t => {
    if (!regex.test(t)) throw new Error(`Invalid time: ${t}`);
  });

  await prisma.therapistProfile.update({
    where: { id: therapistId },
    data: { selectedSlots: slotTimes.sort() }
  });

  return { message: "Available slots updated" };
};

export const createTimeSlots = async (therapistId: string, body: any) => {
  const therapist = await prisma.therapistProfile.findUnique({
    where: { id: therapistId },
    include: { user: true }
  });

  if (!therapist) throw new Error("Therapist not found");

  const timezone = therapist.user.timezone;
  const selectedSlots = body.selectedSlots || therapist.selectedSlots;

  if (!selectedSlots || selectedSlots.length !== REQUIRED_SLOTS_COUNT) {
    throw new Error(`You must set exactly ${REQUIRED_SLOTS_COUNT} slots.`);
  }

  // Update permanent schedule
  await prisma.therapistProfile.update({
    where: { id: therapistId },
    data: { selectedSlots, slotDurationInMinutes: SLOT_DURATION_MINUTES }
  });

  // Remove future unbooked
  await prisma.timeSlot.deleteMany({
    where: {
      therapistId,
      startTime: { gte: new Date() },
      isBooked: false
    }
  });

  // Generate 60 days slots
  const todayLocal = startOfDay(new Date());
  const createData: any[] = [];

  for (let i = 0; i < SLOT_GENERATION_DAYS_AHEAD; i++) {
    const day = addDays(todayLocal, i);

    for (const slot of selectedSlots) {
      const [h, m] = slot.split(":").map(Number);

      const localStart = new Date(day);
      localStart.setHours(h, m, 0, 0);

      const localEnd = addMinutes(localStart, SLOT_DURATION_MINUTES);

      createData.push({
        therapistId,
        startTime: fromZonedTime(localStart, timezone),
        endTime: fromZonedTime(localEnd, timezone),
        isActive: true
      });
    }
  }

 await prisma.timeSlot.createMany({
  data: createData,
  skipDuplicates: true
});

  return { message: "Slots created for next 60 days", count: createData.length };
};

export const getMySlotsForDate = async (therapistId: string, input: { date: string }) => {
  const therapist = await prisma.therapistProfile.findUnique({
    where: { id: therapistId },
    include: { user: true }
  });

  if (!therapist) throw new Error("Therapist not found");

  const timezone = therapist.user.timezone;
  const { date } = input;

  const localStart = new Date(date + "T00:00:00");
  const localEnd = new Date(date + "T23:59:59");

  const start = fromZonedTime(localStart, timezone);
  const end = fromZonedTime(localEnd, timezone);

  return prisma.timeSlot.findMany({
    where: {
      therapistId,
      startTime: { gte: start, lte: end }
    },
    orderBy: { startTime: "asc" }
  });
};


export interface TimeSlotOption {
  startTime: string;  
  endTime: string;    
  label: string;     
}
export interface ScheduleInput {
  selectedSlots: string[]; 
}


export class TherapistScheduleService {
  
  generateAllTimeSlotOptions(): TimeSlotOption[] {
    const slots: TimeSlotOption[] = [];
    const baseDate = new Date(2024, 0, 1); 

    for (let hour = 0; hour < 24; hour++) {
      const startTime = `${hour.toString().padStart(2, '0')}:00`;
      const endHour = (hour + 1) % 24;
      const endTime = `${endHour.toString().padStart(2, '0')}:00`;
      
      // Format for display
      const startDate = parse(startTime, 'HH:mm', baseDate);
      const endDate = parse(endTime, 'HH:mm', baseDate);
      
      const startLabel = this.formatTime(startDate);
      const endLabel = this.formatTime(endDate);
      
      slots.push({
        startTime,
        endTime,
        label: `${startLabel} - ${endLabel}`
      });
    }

    return slots;
  }

  /**
   * Format time to 12-hour format with AM/PM
   */
  private formatTime(date: Date): string {
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const displayHours = hours % 12 || 12;
    return `${displayHours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')} ${ampm}`;
  }

  /**
   * Get therapist profile with current schedule
   */
  async getTherapistProfile(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        timezone: true,
        therapistProfile: {
          select: {
            id: true,
            selectedSlots: true,
            slotDurationInMinutes: true,
          }
        }
      }
    });

    if (!user || !user.therapistProfile) {
      throw new Error('Therapist profile not found');
    }

    return user;
  }

  /**
   * Validate selected slots
   */
  validateSelectedSlots(selectedSlots: string[]): void {
    // Check if exactly 8 slots are selected
    if (selectedSlots.length !== REQUIRED_SLOTS_COUNT) {
      throw new Error(`You must select exactly ${REQUIRED_SLOTS_COUNT} time slots`);
    }

    // Check for duplicates
    const uniqueSlots = new Set(selectedSlots);
    if (uniqueSlots.size !== selectedSlots.length) {
      throw new Error('Duplicate time slots are not allowed');
    }

    // Validate time format (HH:mm)
    const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
    for (const slot of selectedSlots) {
      if (!timeRegex.test(slot)) {
        throw new Error(`Invalid time format: ${slot}. Use HH:mm format`);
      }

      // Validate hour is within 0-23
      const hour = parseInt(slot.split(':')[0]);
      if (hour < 0 || hour > 23) {
        throw new Error(`Invalid hour: ${hour}. Must be between 0-23`);
      }
    }

    // Sort slots to ensure they're in chronological order
    const sortedSlots = [...selectedSlots].sort();
    selectedSlots.length = 0;
    selectedSlots.push(...sortedSlots);
  }

  /**
   * Set permanent schedule for therapist
   */
  async setPermanentSchedule(userId: string, data: ScheduleInput): Promise<TherapistProfile> {
    // Validate input
    this.validateSelectedSlots(data.selectedSlots);

    // Get user profile
    const user = await this.getTherapistProfile(userId);
    const therapistId = user.therapistProfile!.id;

    // Update therapist profile with selected slots
    const updatedProfile = await prisma.therapistProfile.update({
      where: { id: therapistId },
      data: {
        selectedSlots: data.selectedSlots,
        slotDurationInMinutes: SLOT_DURATION_MINUTES,
        maxSlotsPerDay: REQUIRED_SLOTS_COUNT,
      },
    });

    // Delete existing unbooked future slots
    await prisma.timeSlot.deleteMany({
      where: {
        therapistId: therapistId,
        startTime: {
          gte: new Date(), // From now onwards
        },
        isBooked: false,
      }
    });

    // Generate new time slots based on selected schedule
    await this.generateFutureSlots(userId);

    return updatedProfile;
  }

  /**
   * Generate TimeSlot records in UTC for the next 60 days
   */
  async generateFutureSlots(userId: string): Promise<{ count: number }> {
    const user = await this.getTherapistProfile(userId);
    const { therapistProfile, timezone } = user;
    
    if (!therapistProfile?.selectedSlots || therapistProfile.selectedSlots.length === 0) {
      throw new Error('No schedule configured. Please set your permanent schedule first');
    }

    const therapistId = therapistProfile.id;
    const selectedSlots = therapistProfile.selectedSlots as string[];
    
    const slotsToCreate: Array<{
      therapistId: string;
      startTime: Date;
      endTime: Date;
      isBooked: boolean;
      isActive: boolean;
    }> = [];

    // Get today's date at midnight in the therapist's timezone
    const todayLocal = startOfDay(new Date());

    // Generate slots for next 60 days
    for (let dayOffset = 0; dayOffset < SLOT_GENERATION_DAYS_AHEAD; dayOffset++) {
      const currentDay = addDays(todayLocal, dayOffset);

      // For each selected slot time
      for (const slotTime of selectedSlots) {
        // Parse the slot time (e.g., "09:00") and apply to current day
        const [hours, minutes] = slotTime.split(':').map(Number);
        
        // Create local time for this slot
        const localStartTime = new Date(currentDay);
        localStartTime.setHours(hours, minutes, 0, 0);
        
        // Create local end time (1 hour later)
        const localEndTime = addMinutes(localStartTime, SLOT_DURATION_MINUTES);

        // Convert local times to UTC
        const utcStartTime = fromZonedTime(localStartTime, timezone);
        const utcEndTime = fromZonedTime(localEndTime, timezone);

        slotsToCreate.push({
          therapistId,
          startTime: utcStartTime,
          endTime: utcEndTime,
          isBooked: false,
          isActive: true,
        });
      }
    }

    // Batch create all slots
     const result = await prisma.timeSlot.createMany({data: slotsToCreate,skipDuplicates: true});

    return { count: result.count };
  }

  /**
   * Get current schedule configuration
   */
  async getCurrentSchedule(userId: string) {
    const user = await this.getTherapistProfile(userId);
    
    return {
      userId: user.id,
      timezone: user.timezone,
      selectedSlots: user.therapistProfile?.selectedSlots || [],
      slotDurationInMinutes: user.therapistProfile?.slotDurationInMinutes || SLOT_DURATION_MINUTES
    };
  }
}

export const therapistScheduleService = new TherapistScheduleService();