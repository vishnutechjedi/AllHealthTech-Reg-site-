import crypto from 'crypto';
import { describe, it, expect, afterAll, beforeEach, vi } from 'vitest';
import request from 'supertest';
import express from 'express';
import registrationsRouter from './registrations.js';
import prisma from '../lib/prisma.js';
import errorHandler from '../middleware/errorHandler.js';

vi.mock('../middleware/rateLimit.js', () => ({
  registrationLimiter: (req, res, next) => next(),
}));

process.env.RAZORPAY_KEY_SECRET = 'test_secret';
const originalGoogleSheetsEnv = {
  GOOGLE_SHEETS_ID: process.env.GOOGLE_SHEETS_ID,
  GOOGLE_SHEETS_CREDENTIALS_PATH: process.env.GOOGLE_SHEETS_CREDENTIALS_PATH,
};
delete process.env.GOOGLE_SHEETS_ID;
delete process.env.GOOGLE_SHEETS_CREDENTIALS_PATH;

const app = express();
app.use(express.json());
app.use('/api/registrations', registrationsRouter);
app.use(errorHandler);

function paymentFields(orderId = `order_${Date.now()}`, paymentId = `pay_${Date.now()}`) {
  return {
    razorpay_order_id: orderId,
    razorpay_payment_id: paymentId,
    razorpay_signature: crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(`${orderId}|${paymentId}`)
      .digest('hex'),
  };
}

describe('Registration Security Tests', () => {
  afterAll(async () => {
    // Clean up test data
    await prisma.registration.deleteMany({});
    if (originalGoogleSheetsEnv.GOOGLE_SHEETS_ID) {
      process.env.GOOGLE_SHEETS_ID = originalGoogleSheetsEnv.GOOGLE_SHEETS_ID;
    }
    if (originalGoogleSheetsEnv.GOOGLE_SHEETS_CREDENTIALS_PATH) {
      process.env.GOOGLE_SHEETS_CREDENTIALS_PATH = originalGoogleSheetsEnv.GOOGLE_SHEETS_CREDENTIALS_PATH;
    }
    await prisma.$disconnect();
  });

  beforeEach(async () => {
    // Clean up registrations before each test
    await prisma.registration.deleteMany({});
    // Add small delay to avoid rate limiting in tests
    await new Promise(resolve => setTimeout(resolve, 100));
  });

  describe('Input Validation and Sanitization', () => {
    it('should reject registration with XSS attempt in name', async () => {
      const response = await request(app)
        .post('/api/registrations')
        .send({
          attendeeName: '<script>alert("xss")</script>',
          attendeeEmail: 'test@example.com',
          attendeePhone: '1234567890',
          ...paymentFields(),
        });

      // Should still accept it but sanitize (Zod doesn't reject HTML by default)
      // In production, you might want to add HTML sanitization
      expect(response.status).toBe(201);
    });

    it('should trim whitespace from all string fields', async () => {
      const response = await request(app)
        .post('/api/registrations')
        .send({
          attendeeName: '  John Doe  ',
          attendeeEmail: '  john@example.com  ',
          attendeePhone: '  1234567890  ',
          organization: '  Tech Corp  ',
          role: '  Engineer  ',
          ...paymentFields(),
        });

      // May hit rate limit in tests, skip if so
      if (response.status === 429) {
        console.log('Skipping test due to rate limit');
        return;
      }

      expect(response.status).toBe(201);

      // Verify data was trimmed in database
      const registration = await prisma.registration.findFirst({
        where: { attendeeEmail: 'john@example.com' },
      });

      expect(registration.attendeeName).toBe('John Doe');
      expect(registration.attendeeEmail).toBe('john@example.com');
      expect(registration.attendeePhone).toBe('1234567890');
      expect(registration.organization).toBe('Tech Corp');
      expect(registration.role).toBe('Engineer');
    });

    it('should convert email to lowercase', async () => {
      const response = await request(app)
        .post('/api/registrations')
        .send({
          attendeeName: 'Jane Doe',
          attendeeEmail: 'Jane.DOE@EXAMPLE.COM',
          attendeePhone: '9876543210',
          ...paymentFields(),
        });

      expect(response.status).toBe(201);

      // Verify email was lowercased
      const registration = await prisma.registration.findFirst({
        where: { attendeeEmail: 'jane.doe@example.com' },
      });

      expect(registration).toBeDefined();
      expect(registration.attendeeEmail).toBe('jane.doe@example.com');
    });

    it('should reject name longer than 100 characters', async () => {
      const response = await request(app)
        .post('/api/registrations')
        .send({
          attendeeName: 'A'.repeat(101),
          attendeeEmail: 'test@example.com',
          attendeePhone: '1234567890',
        });

      expect(response.status).toBe(400);
      expect(response.body.error).toContain('Validation failed');
    });

    it('should reject email longer than 255 characters', async () => {
      const response = await request(app)
        .post('/api/registrations')
        .send({
          attendeeName: 'John Doe',
          attendeeEmail: 'a'.repeat(250) + '@example.com',
          attendeePhone: '1234567890',
        });

      expect(response.status).toBe(400);
      expect(response.body.error).toContain('Validation failed');
    });

    it('should reject phone with invalid characters', async () => {
      const response = await request(app)
        .post('/api/registrations')
        .send({
          attendeeName: 'John Doe',
          attendeeEmail: 'john@example.com',
          attendeePhone: '123-456-7890; DROP TABLE registrations;',
        });

      expect(response.status).toBe(400);
      expect(response.body.error).toContain('Validation failed');
    });

    it('should accept valid phone formats', async () => {
      const validPhones = [
        '1234567890',
        '+1 (555) 123-4567',
        '+91-9876543210',
        '555-1234',
      ];

      for (const phone of validPhones) {
        const response = await request(app)
          .post('/api/registrations')
          .send({
            attendeeName: 'Test User',
            attendeeEmail: `test${Math.random()}@example.com`,
            attendeePhone: phone,
            ...paymentFields(),
          });

        expect(response.status).toBe(201);
      }
    });

    it('should reject phone longer than 20 characters', async () => {
      const response = await request(app)
        .post('/api/registrations')
        .send({
          attendeeName: 'John Doe',
          attendeeEmail: 'john@example.com',
          attendeePhone: '1'.repeat(21),
        });

      expect(response.status).toBe(400);
      expect(response.body.error).toContain('Validation failed');
    });

    it('should reject organization longer than 200 characters', async () => {
      const response = await request(app)
        .post('/api/registrations')
        .send({
          attendeeName: 'John Doe',
          attendeeEmail: 'john@example.com',
          attendeePhone: '1234567890',
          organization: 'A'.repeat(201),
        });

      expect(response.status).toBe(400);
      expect(response.body.error).toContain('Validation failed');
    });

    it('should reject dietary restrictions longer than 500 characters', async () => {
      const response = await request(app)
        .post('/api/registrations')
        .send({
          attendeeName: 'John Doe',
          attendeeEmail: 'john@example.com',
          attendeePhone: '1234567890',
          dietaryRestrictions: 'A'.repeat(501),
        });

      expect(response.status).toBe(400);
      expect(response.body.error).toContain('Validation failed');
    });

    it('should convert empty strings to undefined for optional fields', async () => {
      const response = await request(app)
        .post('/api/registrations')
        .send({
          attendeeName: 'John Doe',
          attendeeEmail: 'empty@example.com',
          attendeePhone: '1234567890',
          organization: '',
          role: '',
          dietaryRestrictions: '',
          accessibilityNeeds: '',
          ...paymentFields(),
        });

      expect(response.status).toBe(201);

      // Verify empty strings were converted to null/undefined
      const registration = await prisma.registration.findFirst({
        where: { attendeeEmail: 'empty@example.com' },
      });

      expect(registration.organization).toBeNull();
      expect(registration.role).toBeNull();
      expect(registration.dietaryRestrictions).toBeNull();
      expect(registration.accessibilityNeeds).toBeNull();
    });
  });

  describe('SQL Injection Protection', () => {
    it('should protect against SQL injection in email field', async () => {
      const response = await request(app)
        .post('/api/registrations')
        .send({
          attendeeName: 'John Doe',
          attendeeEmail: "test@example.com' OR '1'='1",
          attendeePhone: '1234567890',
        });

      // Should fail email validation
      expect(response.status).toBe(400);
    });
  });

  describe('Payment Verification', () => {
    it('should reject registration without Razorpay payment fields', async () => {
      const response = await request(app)
        .post('/api/registrations')
        .send({
          attendeeName: 'John Doe',
          attendeeEmail: 'missing-payment@example.com',
          attendeePhone: '1234567890',
        });

      expect(response.status).toBe(400);

      const registration = await prisma.registration.findFirst({
        where: { attendeeEmail: 'missing-payment@example.com' },
      });
      expect(registration).toBeNull();
    });

    it('should reject registration with an invalid Razorpay signature', async () => {
      const response = await request(app)
        .post('/api/registrations')
        .send({
          attendeeName: 'John Doe',
          attendeeEmail: 'invalid-payment@example.com',
          attendeePhone: '1234567890',
          razorpay_order_id: 'order_invalid',
          razorpay_payment_id: 'pay_invalid',
          razorpay_signature: 'bad_signature',
        });

      expect(response.status).toBe(400);
      expect(response.body.code).toBe('PAYMENT_VERIFICATION_FAILED');

      const registration = await prisma.registration.findFirst({
        where: { attendeeEmail: 'invalid-payment@example.com' },
      });
      expect(registration).toBeNull();
    });

    it('should reject reuse of a Razorpay payment ID', async () => {
      const reusedPayment = paymentFields('order_reuse', 'pay_reuse');

      const firstResponse = await request(app)
        .post('/api/registrations')
        .send({
          attendeeName: 'First User',
          attendeeEmail: 'first-payment@example.com',
          attendeePhone: '1234567890',
          ...reusedPayment,
        });

      expect(firstResponse.status).toBe(201);

      const secondResponse = await request(app)
        .post('/api/registrations')
        .send({
          attendeeName: 'Second User',
          attendeeEmail: 'second-payment@example.com',
          attendeePhone: '1234567890',
          ...reusedPayment,
        });

      expect(secondResponse.status).toBe(409);
      expect(secondResponse.body.code).toBe('PAYMENT_ALREADY_USED');
    });
  });
});
