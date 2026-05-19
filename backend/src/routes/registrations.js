import { Router } from 'express';
import { z } from 'zod';
import prisma from '../lib/prisma.js';
import validate from '../middleware/validate.js';
import { registrationLimiter } from '../middleware/rateLimit.js';
import { generateTicketId } from '../services/ticketService.js';
import { sendConfirmationEmail } from '../services/emailService.js';
import {
  REGISTRATION_AMOUNT_PAISE,
  verifyRazorpaySignature,
} from '../services/paymentService.js';

const router = Router();

const createRegistrationSchema = z.object({
  // Sanitize and validate name: trim, max length, no special characters that could be XSS
  attendeeName: z.string()
    .min(1, 'Name is required')
    .max(100, 'Name must be less than 100 characters')
    .trim()
    .refine(
      (val) => val.length > 0,
      'Name cannot be empty or only whitespace'
    ),
  // Email validation with stricter rules
  attendeeEmail: z.string()
    .max(255, 'Email must be less than 255 characters')
    .trim()
    .email('Invalid email format')
    .toLowerCase(),
  // Phone validation: min 7, max 20 characters
  attendeePhone: z.string()
    .min(7, 'Phone number must be at least 7 characters')
    .max(20, 'Phone number must be less than 20 characters')
    .trim()
    .refine(
      (val) => /^[0-9+\-\s()]+$/.test(val),
      'Phone number can only contain numbers, +, -, spaces, and parentheses'
    ),
  // Optional fields with max length and sanitization
  organization: z.string()
    .max(200, 'Organization name must be less than 200 characters')
    .trim()
    .optional()
    .transform(val => val === '' ? undefined : val),
  role: z.string()
    .max(100, 'Role must be less than 100 characters')
    .trim()
    .optional()
    .transform(val => val === '' ? undefined : val),
  dietaryRestrictions: z.string()
    .max(500, 'Dietary restrictions must be less than 500 characters')
    .trim()
    .optional()
    .transform(val => val === '' ? undefined : val),
  accessibilityNeeds: z.string()
    .max(500, 'Accessibility needs must be less than 500 characters')
    .trim()
    .optional()
    .transform(val => val === '' ? undefined : val),
  razorpay_order_id: z.string().min(1, 'Razorpay order ID is required').trim(),
  razorpay_payment_id: z.string().min(1, 'Razorpay payment ID is required').trim(),
  razorpay_signature: z.string().min(1, 'Razorpay signature is required').trim(),
});

router.post(
  '/',
  registrationLimiter,
  validate(createRegistrationSchema),
  async (req, res, next) => {
    try {
      const {
        attendeeName,
        attendeeEmail,
        attendeePhone,
        organization,
        role,
        dietaryRestrictions,
        accessibilityNeeds,
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature,
      } = req.body;

      // Check for duplicate email registration
      const existingRegistration = await prisma.registration.findFirst({
        where: {
          attendeeEmail,
          status: { not: 'CANCELLED' },
        },
      });

      if (existingRegistration) {
        return res.status(409).json({
          error: 'This email is already registered for the event',
          code: 'DUPLICATE_EMAIL',
        });
      }

      const isPaymentValid = verifyRazorpaySignature({
        orderId: razorpay_order_id,
        paymentId: razorpay_payment_id,
        signature: razorpay_signature,
      });

      if (!isPaymentValid) {
        return res.status(400).json({
          error: 'Payment verification failed. Registration was not created.',
          code: 'PAYMENT_VERIFICATION_FAILED',
        });
      }

      const existingPayment = await prisma.registration.findFirst({
        where: {
          razorpayPaymentId: razorpay_payment_id,
        },
      });

      if (existingPayment) {
        return res.status(409).json({
          error: 'This payment has already been used for a registration',
          code: 'PAYMENT_ALREADY_USED',
        });
      }

      // Generate ticket ID and create registration
      const ticketId = await generateTicketId(prisma);

      const registration = await prisma.registration.create({
        data: {
          ticketId,
          attendeeName,
          attendeeEmail,
          attendeePhone,
          organization,
          role,
          dietaryRestrictions,
          accessibilityNeeds,
          status: 'CONFIRMED',
          paymentStatus: 'PAID',
          paymentTransactionId: razorpay_payment_id,
          razorpayOrderId: razorpay_order_id,
          razorpayPaymentId: razorpay_payment_id,
          razorpaySignature: razorpay_signature,
          amountPaid: REGISTRATION_AMOUNT_PAISE,
        },
      });

      // Send confirmation email asynchronously (don't wait for it)
      sendConfirmationEmail(registration).catch((err) =>
        console.error('Failed to send confirmation email:', err)
      );

      // Sync to Google Sheets asynchronously (don't wait for it)
      syncRegistrationToGoogleSheets(registration).catch((err) =>
        console.error('Failed to sync registration to Google Sheets:', err)
      );

      return res.status(201).json({
        success: true,
        registrationId: registration.id,
        ticketId: registration.ticketId,
      });
    } catch (err) {
      next(err);
    }
  }
);

/**
 * Sync registration to Google Sheets with retry logic
 * @param {Object} registration - Registration object with relations
 */
async function syncRegistrationToGoogleSheets(registration) {
  // Skip if Google Sheets is not configured
  if (!process.env.GOOGLE_SHEETS_ID || !process.env.GOOGLE_SHEETS_CREDENTIALS_PATH) {
    console.log('[Registration] Google Sheets sync is not configured, skipping');
    return;
  }

  try {
    // Lazy load Google Sheets modules
    const { syncRegistrationToSheets, TransientSyncError, PermanentSyncError } = await import('../services/googleSheetsService.js');
    const { queueFailedSync } = await import('../services/retryManager.js');

    const googleSheetsConfig = {
      spreadsheetId: process.env.GOOGLE_SHEETS_ID,
      sheetName: process.env.GOOGLE_SHEETS_SHEET_NAME || 'Registrations',
      credentialsPath: process.env.GOOGLE_SHEETS_CREDENTIALS_PATH,
    };

    await syncRegistrationToSheets(registration, googleSheetsConfig);
  } catch (error) {
    // Lazy load error classes for instanceof checks
    const { TransientSyncError, PermanentSyncError } = await import('../services/googleSheetsService.js');
    const { queueFailedSync } = await import('../services/retryManager.js');

    if (error instanceof TransientSyncError) {
      // Queue for retry
      await queueFailedSync(
        registration.id,
        registration,
        error.message,
        'TRANSIENT'
      );
      console.log('[Registration] Transient sync error queued for retry:', {
        registrationId: registration.id,
        error: error.message,
      });
    } else if (error instanceof PermanentSyncError) {
      // Move to dead letter queue
      const failedSync = await queueFailedSync(
        registration.id,
        registration,
        error.message,
        'PERMANENT'
      );
      // Move to dead letter immediately
      await prisma.deadLetterSync.create({
        data: {
          registrationId: registration.id,
          registrationData: registration,
          error: error.message,
          errorType: 'PERMANENT',
          retryCount: 0,
          lastAttemptTime: new Date(),
        },
      });
      await prisma.failedSync.delete({
        where: { id: failedSync.id },
      });
      console.error('[Registration] Permanent sync error moved to dead letter queue:', {
        registrationId: registration.id,
        error: error.message,
      });
      // TODO: Alert support team
    } else {
      // Unknown error - treat as transient
      await queueFailedSync(
        registration.id,
        registration,
        error.message,
        'TRANSIENT'
      );
      console.error('[Registration] Unknown sync error queued for retry:', {
        registrationId: registration.id,
        error: error.message,
      });
    }
  }
}

export default router;
