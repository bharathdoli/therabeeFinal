import type { Request, Response } from 'express';
import * as therapistService from './therapist.service';
import prisma from '../../utils/prisma';
import { SetScheduleInput } from './therapist.validation';

const getTherapistId = async (userId: string) => {
    const profile = await prisma.therapistProfile.findUnique({ where: { userId }, select: { id: true } });
    if (!profile) throw new Error('Therapist profile not found');
    return profile.id;
}

export const getMyProfileHandler = async (req: Request, res: Response) => {
    try {
        const profile = await therapistService.getTherapistProfile(req.user!.userId);
        res.status(200).json(profile);
    } catch (error: any) {
        res.status(404).json({ message: error.message });
    }
};
export const requestLeaveHandler = async (req: Request, res: Response) => {
  try {
    const therapistId = await getTherapistId(req.user!.userId);
    const result = await therapistService.requestLeave(therapistId, req.body);
    res.status(200).json(result);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export interface ScheduleInput {
  selectedSlots: string[];
}

export const createTimeSlotsHandler = async (req: Request, res: Response) => {
   try {
    const userId = req.user!.userId;
    const scheduleData: ScheduleInput = req.body;

    const updatedProfile = await therapistService.therapistScheduleService.setPermanentSchedule(
      userId,
      scheduleData
    );

    return res.status(200).json({
      success: true,
      message: 'Schedule updated successfully.',
      data: {
        selectedSlots: updatedProfile.selectedSlots,
        slotDurationInMinutes: updatedProfile.slotDurationInMinutes,
        maxSlotsPerDay: updatedProfile.maxSlotsPerDay,
      }
    });
  } catch (error) {
    console.error('Error setting schedule:', error);
    
    
    if (error instanceof Error) {
      if (error.message.includes('must select exactly')) {
        return res.status(400).json({
          success: false,
          message: error.message
        });
      }
      if (error.message.includes('Duplicate')) {
        return res.status(400).json({
          success: false,
          message: error.message
        });
      }
      if (error.message.includes('Invalid')) {
        return res.status(400).json({
          success: false,
          message: error.message
        });
      }
    }

    return res.status(500).json({
      success: false,
      message: 'Failed to set schedule',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

export const setAvailableSlotTimesHandler = async (req: Request, res: Response) => {
  try {
    const therapistId = await getTherapistId(req.user!.userId);
    const result = await therapistService.setAvailableSlotTimes(therapistId, req.body.slotTimes);
    res.json(result);
  } catch (e: any) {
    res.status(400).json({ message: e.message });
  }
};

export const getMySlotsForDateHandler = async (req: Request, res: Response) => {
  try {
    const therapistId = await getTherapistId(req.user!.userId);
    const result = await therapistService.getMySlotsForDate(therapistId, { date: req.query.date as string });
    res.json(result);
  } catch (e: any) {
    res.status(400).json({ message: e.message });
  }
};

export const checkHasActiveSlotsHandler = async (req: Request, res: Response) => {
  try {
    const therapistId = await getTherapistId(req.user!.userId);
    const result = await therapistService.hasActiveSlots(therapistId);
    res.json({ hasActiveSlots: result });
  } catch (e: any) {
    res.status(400).json({ message: e.message });
  }
};
