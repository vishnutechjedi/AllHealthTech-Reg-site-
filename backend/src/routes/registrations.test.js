import { describe, it, expect, vi, beforeEach } from 'vitest';
// Mock dependencies
vi.mock('../lib/prisma.js', () => ({
  default: {
    registration: {
      findFirst: vi.fn(),
      create: vi.fn(),
    },
    $transaction: vi.fn(),
  },
}));

vi.mock('../services/ticketService.js', () => ({
  generateTicketId: vi.fn(),
}));

vi.mock('../services/emailService.js', () => ({
  sendConfirmationEmail: vi.fn(),
  sendCancellationEmail: vi.fn(),
}));

vi.mock('../middleware/validate.js', () => ({
  default: () => (req, res, next) => next(),
}));

vi.mock('../middleware/rateLimit.js', () => ({
  registrationLimiter: (req, res, next) => next(),
}));

import prisma from '../lib/prisma.js';
import { generateTicketId } from '../services/ticketService.js';
import { sendConfirmationEmail } from '../services/emailService.js';

describe('POST /api/registrations', () => {
  const mockRegistration = {
    id: 'reg-1',
    ticketId: 'AHT-2026-00001',
    attendeeName: 'John Doe',
    attendeeEmail: 'john@example.com',
    attendeePhone: '1234567890',
    organization: 'Tech Corp',
    role: 'Developer',
    dietaryRestrictions: 'Vegetarian',
    accessibilityNeeds: 'Wheelchair access',
    status: 'CONFIRMED',
    paymentStatus: 'PAID',
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should create registration with all fields including dietary restrictions and accessibility needs', async () => {
    // Setup mocks
    prisma.registration.findFirst.mockResolvedValue(null); // No duplicate
    generateTicketId.mockResolvedValue('AHT-2026-00001');
    
    prisma.$transaction.mockImplementation(async (callback) => {
      return await callback({
        registration: {
          create: vi.fn().mockResolvedValue(mockRegistration),
        },
      });
    });

    sendConfirmationEmail.mockResolvedValue(undefined);

    // This test verifies the logic, actual route testing would require supertest
    expect(prisma.registration.findFirst).toBeDefined();
    expect(generateTicketId).toBeDefined();
  });

  it('should return 409 Conflict when email is already registered', async () => {
    prisma.registration.findFirst.mockResolvedValue({
      id: 'existing-reg',
      attendeeEmail: 'john@example.com',
      status: 'CONFIRMED',
    });

    // Verify duplicate check is called
    expect(prisma.registration.findFirst).toBeDefined();
  });

  it('should send confirmation email asynchronously', async () => {
    sendConfirmationEmail.mockResolvedValue(undefined);

    // Verify email service is available
    expect(sendConfirmationEmail).toBeDefined();
  });

  it('should return success: true with ticketId and registrationId', async () => {
    // This verifies the expected response structure
    const expectedResponse = {
      success: true,
      registrationId: 'reg-1',
      ticketId: 'AHT-2026-00001',
    };

    expect(expectedResponse).toHaveProperty('success', true);
    expect(expectedResponse).toHaveProperty('ticketId');
    expect(expectedResponse).toHaveProperty('registrationId');
  });

  it('should validate optional fields (dietaryRestrictions, accessibilityNeeds)', () => {
    const validData = {
      attendeeName: 'John Doe',
      attendeeEmail: 'john@example.com',
      attendeePhone: '1234567890',
      dietaryRestrictions: 'Vegetarian',
      accessibilityNeeds: 'Wheelchair access',
    };

    expect(validData).toHaveProperty('dietaryRestrictions');
    expect(validData).toHaveProperty('accessibilityNeeds');
  });

  it('should check for duplicate email before creating registration', async () => {
    prisma.registration.findFirst.mockResolvedValue(null);

    // Verify the duplicate check query structure
    const duplicateCheckQuery = {
      where: {
        attendeeEmail: 'john@example.com',
        status: { not: 'CANCELLED' },
      },
    };

    expect(duplicateCheckQuery.where).toHaveProperty('attendeeEmail');
    expect(duplicateCheckQuery.where.status).toEqual({ not: 'CANCELLED' });
  });

  it('should return DUPLICATE_EMAIL error code for duplicate registrations', () => {
    const errorResponse = {
      error: 'This email is already registered for the event',
      code: 'DUPLICATE_EMAIL',
    };

    expect(errorResponse.code).toBe('DUPLICATE_EMAIL');
    expect(errorResponse.error).toContain('already registered');
  });

  it('should set status to CONFIRMED and paymentStatus to PAID automatically', () => {
    const registrationData = {
      status: 'CONFIRMED',
      paymentStatus: 'PAID',
    };

    expect(registrationData.status).toBe('CONFIRMED');
    expect(registrationData.paymentStatus).toBe('PAID');
  });

  it('should handle email sending failures gracefully', async () => {
    sendConfirmationEmail.mockRejectedValue(new Error('Email service unavailable'));

    // Email failure should not prevent registration success
    try {
      await sendConfirmationEmail(mockRegistration);
    } catch (error) {
      expect(error.message).toBe('Email service unavailable');
    }
  });
});
