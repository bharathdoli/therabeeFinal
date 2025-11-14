"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.therapistScheduleService = exports.TherapistScheduleService = exports.getMySlotsForDate = exports.createTimeSlots = exports.setAvailableSlotTimes = exports.hasActiveSlots = exports.getTherapistProfile = exports.requestLeave = void 0;
const client_1 = require("@prisma/client");
const prisma_1 = __importDefault(require("../../utils/prisma"));
const requestLeave = (therapistId, input) => __awaiter(void 0, void 0, void 0, function* () {
    const therapist = yield prisma_1.default.therapistProfile.findUnique({ where: { id: therapistId }, include: { user: true } });
    if (!therapist)
        throw new Error('Therapist not found.');
    if (therapist.leavesRemainingThisMonth <= 0)
        throw new Error('No leaves remaining.');
    const leaveDate = new Date(input.date);
    const startOfDay = new Date(leaveDate.setUTCHours(0, 0, 0, 0));
    // Create a pending leave request; admin will approve/reject later
    yield prisma_1.default.$transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
        yield tx.therapistLeave.create({ data: { therapistId, date: startOfDay, type: input.type, reason: input.reason, status: client_1.LeaveStatus.PENDING } });
    }));
});
exports.requestLeave = requestLeave;
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
const date_fns_1 = require("date-fns");
const date_fns_tz_1 = require("date-fns-tz");
const SLOT_GENERATION_DAYS_AHEAD = 60;
const REQUIRED_SLOTS_COUNT = 8;
const SLOT_DURATION_MINUTES = 60;
const getTherapistProfile = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    return prisma_1.default.therapistProfile.findUnique({ where: { userId } });
});
exports.getTherapistProfile = getTherapistProfile;
const hasActiveSlots = (therapistId) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const profile = yield prisma_1.default.therapistProfile.findUnique({
        where: { id: therapistId },
        select: { selectedSlots: true }
    });
    return ((_b = (_a = profile === null || profile === void 0 ? void 0 : profile.selectedSlots) === null || _a === void 0 ? void 0 : _a.length) !== null && _b !== void 0 ? _b : 0) > 0;
});
exports.hasActiveSlots = hasActiveSlots;
const setAvailableSlotTimes = (therapistId, slotTimes) => __awaiter(void 0, void 0, void 0, function* () {
    if (slotTimes.length !== REQUIRED_SLOTS_COUNT)
        throw new Error(`You must select exactly ${REQUIRED_SLOTS_COUNT} slots.`);
    const regex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
    slotTimes.forEach(t => {
        if (!regex.test(t))
            throw new Error(`Invalid time: ${t}`);
    });
    yield prisma_1.default.therapistProfile.update({
        where: { id: therapistId },
        data: { selectedSlots: slotTimes.sort() }
    });
    return { message: "Available slots updated" };
});
exports.setAvailableSlotTimes = setAvailableSlotTimes;
const createTimeSlots = (therapistId, body) => __awaiter(void 0, void 0, void 0, function* () {
    const therapist = yield prisma_1.default.therapistProfile.findUnique({
        where: { id: therapistId },
        include: { user: true }
    });
    if (!therapist)
        throw new Error("Therapist not found");
    const timezone = therapist.user.timezone;
    const selectedSlots = body.selectedSlots || therapist.selectedSlots;
    if (!selectedSlots || selectedSlots.length !== REQUIRED_SLOTS_COUNT) {
        throw new Error(`You must set exactly ${REQUIRED_SLOTS_COUNT} slots.`);
    }
    // Update permanent schedule
    yield prisma_1.default.therapistProfile.update({
        where: { id: therapistId },
        data: { selectedSlots, slotDurationInMinutes: SLOT_DURATION_MINUTES }
    });
    // Remove future unbooked
    yield prisma_1.default.timeSlot.deleteMany({
        where: {
            therapistId,
            startTime: { gte: new Date() },
            isBooked: false
        }
    });
    // Generate 60 days slots
    const todayLocal = (0, date_fns_1.startOfDay)(new Date());
    const createData = [];
    for (let i = 0; i < SLOT_GENERATION_DAYS_AHEAD; i++) {
        const day = (0, date_fns_1.addDays)(todayLocal, i);
        for (const slot of selectedSlots) {
            const [h, m] = slot.split(":").map(Number);
            const localStart = new Date(day);
            localStart.setHours(h, m, 0, 0);
            const localEnd = (0, date_fns_1.addMinutes)(localStart, SLOT_DURATION_MINUTES);
            createData.push({
                therapistId,
                startTime: (0, date_fns_tz_1.fromZonedTime)(localStart, timezone),
                endTime: (0, date_fns_tz_1.fromZonedTime)(localEnd, timezone),
                isActive: true
            });
        }
    }
    yield prisma_1.default.timeSlot.createMany({
        data: createData,
        skipDuplicates: true
    });
    return { message: "Slots created for next 60 days", count: createData.length };
});
exports.createTimeSlots = createTimeSlots;
const getMySlotsForDate = (therapistId, input) => __awaiter(void 0, void 0, void 0, function* () {
    const therapist = yield prisma_1.default.therapistProfile.findUnique({
        where: { id: therapistId },
        include: { user: true }
    });
    if (!therapist)
        throw new Error("Therapist not found");
    const timezone = therapist.user.timezone;
    const { date } = input;
    const localStart = new Date(date + "T00:00:00");
    const localEnd = new Date(date + "T23:59:59");
    const start = (0, date_fns_tz_1.fromZonedTime)(localStart, timezone);
    const end = (0, date_fns_tz_1.fromZonedTime)(localEnd, timezone);
    return prisma_1.default.timeSlot.findMany({
        where: {
            therapistId,
            startTime: { gte: start, lte: end }
        },
        orderBy: { startTime: "asc" }
    });
});
exports.getMySlotsForDate = getMySlotsForDate;
class TherapistScheduleService {
    generateAllTimeSlotOptions() {
        const slots = [];
        const baseDate = new Date(2024, 0, 1);
        for (let hour = 0; hour < 24; hour++) {
            const startTime = `${hour.toString().padStart(2, '0')}:00`;
            const endHour = (hour + 1) % 24;
            const endTime = `${endHour.toString().padStart(2, '0')}:00`;
            // Format for display
            const startDate = (0, date_fns_1.parse)(startTime, 'HH:mm', baseDate);
            const endDate = (0, date_fns_1.parse)(endTime, 'HH:mm', baseDate);
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
    formatTime(date) {
        const hours = date.getHours();
        const minutes = date.getMinutes();
        const ampm = hours >= 12 ? 'PM' : 'AM';
        const displayHours = hours % 12 || 12;
        return `${displayHours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')} ${ampm}`;
    }
    /**
     * Get therapist profile with current schedule
     */
    getTherapistProfile(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield prisma_1.default.user.findUnique({
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
        });
    }
    /**
     * Validate selected slots
     */
    validateSelectedSlots(selectedSlots) {
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
    setPermanentSchedule(userId, data) {
        return __awaiter(this, void 0, void 0, function* () {
            // Validate input
            this.validateSelectedSlots(data.selectedSlots);
            // Get user profile
            const user = yield this.getTherapistProfile(userId);
            const therapistId = user.therapistProfile.id;
            // Update therapist profile with selected slots
            const updatedProfile = yield prisma_1.default.therapistProfile.update({
                where: { id: therapistId },
                data: {
                    selectedSlots: data.selectedSlots,
                    slotDurationInMinutes: SLOT_DURATION_MINUTES,
                    maxSlotsPerDay: REQUIRED_SLOTS_COUNT,
                },
            });
            // Delete existing unbooked future slots
            yield prisma_1.default.timeSlot.deleteMany({
                where: {
                    therapistId: therapistId,
                    startTime: {
                        gte: new Date(), // From now onwards
                    },
                    isBooked: false,
                }
            });
            // Generate new time slots based on selected schedule
            yield this.generateFutureSlots(userId);
            return updatedProfile;
        });
    }
    /**
     * Generate TimeSlot records in UTC for the next 60 days
     */
    generateFutureSlots(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.getTherapistProfile(userId);
            const { therapistProfile, timezone } = user;
            if (!(therapistProfile === null || therapistProfile === void 0 ? void 0 : therapistProfile.selectedSlots) || therapistProfile.selectedSlots.length === 0) {
                throw new Error('No schedule configured. Please set your permanent schedule first');
            }
            const therapistId = therapistProfile.id;
            const selectedSlots = therapistProfile.selectedSlots;
            const slotsToCreate = [];
            // Get today's date at midnight in the therapist's timezone
            const todayLocal = (0, date_fns_1.startOfDay)(new Date());
            // Generate slots for next 60 days
            for (let dayOffset = 0; dayOffset < SLOT_GENERATION_DAYS_AHEAD; dayOffset++) {
                const currentDay = (0, date_fns_1.addDays)(todayLocal, dayOffset);
                // For each selected slot time
                for (const slotTime of selectedSlots) {
                    // Parse the slot time (e.g., "09:00") and apply to current day
                    const [hours, minutes] = slotTime.split(':').map(Number);
                    // Create local time for this slot
                    const localStartTime = new Date(currentDay);
                    localStartTime.setHours(hours, minutes, 0, 0);
                    // Create local end time (1 hour later)
                    const localEndTime = (0, date_fns_1.addMinutes)(localStartTime, SLOT_DURATION_MINUTES);
                    // Convert local times to UTC
                    const utcStartTime = (0, date_fns_tz_1.fromZonedTime)(localStartTime, timezone);
                    const utcEndTime = (0, date_fns_tz_1.fromZonedTime)(localEndTime, timezone);
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
            const result = yield prisma_1.default.timeSlot.createMany({ data: slotsToCreate, skipDuplicates: true });
            return { count: result.count };
        });
    }
    /**
     * Get current schedule configuration
     */
    getCurrentSchedule(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            const user = yield this.getTherapistProfile(userId);
            return {
                userId: user.id,
                timezone: user.timezone,
                selectedSlots: ((_a = user.therapistProfile) === null || _a === void 0 ? void 0 : _a.selectedSlots) || [],
                slotDurationInMinutes: ((_b = user.therapistProfile) === null || _b === void 0 ? void 0 : _b.slotDurationInMinutes) || SLOT_DURATION_MINUTES
            };
        });
    }
}
exports.TherapistScheduleService = TherapistScheduleService;
exports.therapistScheduleService = new TherapistScheduleService();
