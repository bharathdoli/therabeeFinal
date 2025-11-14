import { Router } from 'express';
import { authenticate, authorize } from '../../middleware/auth.middleware';
import { validate } from '../../middleware/validate.middleware';
import { Role } from '@prisma/client';
import {
  getMyProfileHandler,
  createTimeSlotsHandler,
  requestLeaveHandler,
  getMySlotsForDateHandler,
  checkHasActiveSlotsHandler,
  setAvailableSlotTimesHandler,
} from './therapist.controller';
import { createTimeSlotsSchema, requestLeaveSchema, getSlotsForDateSchema, setAvailableSlotTimesSchema, setScheduleSchema } from './therapist.validation';

import prisma from '../../utils/prisma';
import z from 'zod';

type CreateTimeSlotsInput = z.infer<typeof createTimeSlotsSchema>['body'];
type setAvailableSlotTimesSchemaInput = z.infer<typeof setAvailableSlotTimesSchema>['body'];
type getSlotsForDateSchemaInput = z.infer<typeof getSlotsForDateSchema>['query'];

const router = Router();


router.get('/public', async (req, res) => {
  try {
    console.log('Public therapists endpoint hit!'); 
    const therapists = await prisma.therapistProfile.findMany({
      where: { status: 'ACTIVE' },
      select: {
        id: true,
        name: true,
        specialization: true,
        experience: true,
        baseCostPerSession: true,
        averageRating: true,
      },
    });
    console.log('Found therapists:', therapists.length); 
    res.json(therapists);
  } catch (error: any) {
    console.error('Error in public therapists endpoint:', error); 
    res.status(500).json({ message: error.message });
  }
});

router.get('/test', (req, res) => {
  res.json({ message: 'Public test route works!' });
});


router.use(authenticate, authorize([Role.THERAPIST]));

router.get('/me/profile', getMyProfileHandler);
router.get('/me/slots/check', checkHasActiveSlotsHandler);
router.put('/me/slots/available-times',validate({ body: setAvailableSlotTimesSchema.shape.body }),setAvailableSlotTimesHandler);
router.post('/me/slots', validate({body : setScheduleSchema.shape.body}), createTimeSlotsHandler)
router.get('/me/slots',validate({ query: getSlotsForDateSchema.shape.query }),getMySlotsForDateHandler)
router.post('/me/leaves', validate({body : requestLeaveSchema.shape.body}), requestLeaveHandler);

export default router;