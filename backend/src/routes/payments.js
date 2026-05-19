import { Router } from 'express';
import { z } from 'zod';
import validate from '../middleware/validate.js';
import {
  createRegistrationOrder,
  REGISTRATION_AMOUNT_PAISE,
  REGISTRATION_CURRENCY,
} from '../services/paymentService.js';

const router = Router();

const createOrderSchema = z.object({
  attendeeName: z.string().min(1, 'Name is required').max(100).trim(),
  attendeeEmail: z.string().max(255).trim().email('Invalid email format').toLowerCase(),
});

router.post('/order', validate(createOrderSchema), async (req, res, next) => {
  try {
    const order = await createRegistrationOrder(req.body);

    return res.status(201).json({
      success: true,
      orderId: order.id,
      amount: REGISTRATION_AMOUNT_PAISE,
      currency: REGISTRATION_CURRENCY,
      keyId: process.env.RAZORPAY_KEY_ID,
    });
  } catch (err) {
    next(err);
  }
});

export default router;
