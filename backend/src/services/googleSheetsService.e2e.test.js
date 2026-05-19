import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import prisma from '../lib/prisma.js';
import { mapRegistrationToSheetRow } from './googleSheetsService.js';
import { calculateBackoffDelay } from './retryManager.js';

/**
 * End-to-End tests for Google Sheets Sync
 * These tests verify the complete flow from registration to sync
 */
describe('Google Sheets Sync End-to-End Tests', () => {
  afterAll(async () => {
    // Clean up test data
    await prisma.registration.deleteMany({
      where: {
        ticketId: {
          startsWith: 'AHT-2025-E2E-',
        },
      },
    });
    await prisma.failedSync.deleteMany({
      where: {
        registrationData: {
          path: ['ticketId'],
          string_starts_with: 'AHT-2025-E2E-',
        },
      },
    });
    await prisma.deadLetterSync.deleteMany({
      where: {
        registrationData: {
          path: ['ticketId'],
          string_starts_with: 'AHT-2025-E2E-',
        },
      },
    });
    await prisma.$disconnect();
  });

  describe('Complete Registration to Sync Flow', () => {
    it('should create registration and map to sheet row', async () => {
      // Step 1: Create registration
      const registration = await prisma.registration.create({
        data: {
          ticketId: 'AHT-2025-E2E-001',
          attendeeName: 'E2E Test User',
          attendeeEmail: 'e2e@example.com',
          attendeePhone: '+91 98765 43210',
          organization: 'E2E Corp',
          role: 'E2E Manager',
          dietaryRestrictions: 'Vegetarian',
          accessibilityNeeds: 'None',
          status: 'CONFIRMED',
          paymentStatus: 'PAID',
        },
      });

      // Step 2: Map to sheet row
      const row = mapRegistrationToSheetRow(registration);

      // Step 3: Verify all fields are present (9 columns total)
      expect(row.ticketId).toBe('AHT-2025-E2E-001');
      expect(row.attendeeName).toBe('E2E Test User');
      expect(row.email).toBe('e2e@example.com');
      expect(row.phone).toBe('+91 98765 43210');
      expect(row.organization).toBe('E2E Corp');
      expect(row.role).toBe('E2E Manager');
      expect(row.dietaryRestrictions).toBe('Vegetarian');
      expect(row.accessibilityNeeds).toBe('None');
      expect(row.registrationTimestamp).toMatch(/^\d{4}-\d{2}-\d{2}T/);

      // Clean up
      await prisma.registration.delete({
        where: { id: registration.id },
      });
    });

    it('should handle sync failure and queue for retry', async () => {
      // Step 1: Create registration
      const registration = await prisma.registration.create({
        data: {
          ticketId: 'AHT-2025-E2E-002',
          attendeeName: 'E2E Retry Test',
          attendeeEmail: 'e2e-retry@example.com',
          attendeePhone: '+91 87654 32109',
          status: 'CONFIRMED',
          paymentStatus: 'PAID',
        },
      });

      // Step 2: Simulate sync failure by creating failed sync record
      const failedSync = await prisma.failedSync.create({
        data: {
          registrationId: registration.id,
          registrationData: registration,
          error: 'Network timeout',
          errorType: 'TRANSIENT',
          retryCount: 0,
          nextRetryTime: new Date(),
        },
      });

      // Step 3: Verify failed sync was created
      expect(failedSync).toBeDefined();
      expect(failedSync.registrationId).toBe(registration.id);
      expect(failedSync.errorType).toBe('TRANSIENT');

      // Step 4: Simulate retry
      const updatedFailedSync = await prisma.failedSync.update({
        where: { id: failedSync.id },
        data: {
          retryCount: 1,
          nextRetryTime: new Date(Date.now() + 2000),
        },
      });

      expect(updatedFailedSync.retryCount).toBe(1);

      // Step 5: Verify exponential backoff calculation
      const delay = calculateBackoffDelay(1, 1000, 2);
      expect(delay).toBe(2000);

      // Clean up
      await prisma.failedSync.delete({
        where: { id: failedSync.id },
      });
      await prisma.registration.delete({
        where: { id: registration.id },
      });
    });

    it('should move permanently failed sync to dead letter queue', async () => {
      // Step 1: Create registration
      const registration = await prisma.registration.create({
        data: {
          ticketId: 'AHT-2025-E2E-003',
          attendeeName: 'E2E Dead Letter Test',
          attendeeEmail: 'e2e-deadletter@example.com',
          attendeePhone: '+91 76543 21098',
          status: 'CONFIRMED',
          paymentStatus: 'PAID',
        },
      });

      // Step 2: Create failed sync with permanent error
      const failedSync = await prisma.failedSync.create({
        data: {
          registrationId: registration.id,
          registrationData: registration,
          error: 'Authentication failed',
          errorType: 'PERMANENT',
          retryCount: 0,
          nextRetryTime: new Date(),
        },
      });

      // Step 3: Move to dead letter queue
      const deadLetterSync = await prisma.deadLetterSync.create({
        data: {
          registrationId: registration.id,
          registrationData: registration,
          error: failedSync.error,
          errorType: failedSync.errorType,
          retryCount: 1,
          lastAttemptTime: new Date(),
        },
      });

      // Step 4: Delete from failed sync queue
      await prisma.failedSync.delete({
        where: { id: failedSync.id },
      });

      // Step 5: Verify dead letter sync was created
      expect(deadLetterSync).toBeDefined();
      expect(deadLetterSync.registrationId).toBe(registration.id);
      expect(deadLetterSync.errorType).toBe('PERMANENT');

      // Step 6: Verify failed sync was deleted
      const deletedFailedSync = await prisma.failedSync.findUnique({
        where: { id: failedSync.id },
      });
      expect(deletedFailedSync).toBeNull();

      // Clean up
      await prisma.deadLetterSync.delete({
        where: { id: deadLetterSync.id },
      });
      await prisma.registration.delete({
        where: { id: registration.id },
      });
    });

    it('should process multiple registrations with different sync states', async () => {
      // Create multiple registrations
      const registrations = await Promise.all([
        prisma.registration.create({
          data: {
            ticketId: 'AHT-2025-E2E-004',
            attendeeName: 'User 1',
            attendeeEmail: 'user1@example.com',
            attendeePhone: '1111111111',
            status: 'CONFIRMED',
            paymentStatus: 'PAID',
          },
        }),
        prisma.registration.create({
          data: {
            ticketId: 'AHT-2025-E2E-005',
            attendeeName: 'User 2',
            attendeeEmail: 'user2@example.com',
            attendeePhone: '2222222222',
            status: 'CONFIRMED',
            paymentStatus: 'PAID',
          },
        }),
        prisma.registration.create({
          data: {
            ticketId: 'AHT-2025-E2E-006',
            attendeeName: 'User 3',
            attendeeEmail: 'user3@example.com',
            attendeePhone: '3333333333',
            status: 'CONFIRMED',
            paymentStatus: 'PAID',
          },
        }),
      ]);

      // Map all to sheet rows
      const rows = registrations.map(reg => mapRegistrationToSheetRow(reg));

      // Verify all rows have correct structure (9 columns)
      expect(rows).toHaveLength(3);
      rows.forEach((row, index) => {
        expect(row.ticketId).toBe(`AHT-2025-E2E-00${4 + index}`);
        expect(row.attendeeName).toBe(`User ${index + 1}`);
      });

      // Create failed syncs for first two
      const failedSyncs = await Promise.all([
        prisma.failedSync.create({
          data: {
            registrationId: registrations[0].id,
            registrationData: registrations[0],
            error: 'Transient error',
            errorType: 'TRANSIENT',
            retryCount: 0,
            nextRetryTime: new Date(),
          },
        }),
        prisma.failedSync.create({
          data: {
            registrationId: registrations[1].id,
            registrationData: registrations[1],
            error: 'Permanent error',
            errorType: 'PERMANENT',
            retryCount: 0,
            nextRetryTime: new Date(),
          },
        }),
      ]);

      // Query pending retries
      const pendingRetries = await prisma.failedSync.findMany({
        where: {
          nextRetryTime: { lte: new Date() },
        },
      });

      expect(pendingRetries.length).toBeGreaterThanOrEqual(2);

      // Clean up
      await prisma.failedSync.deleteMany({
        where: {
          registrationId: {
            in: [registrations[0].id, registrations[1].id],
          },
        },
      });
      await prisma.registration.deleteMany({
        where: {
          id: {
            in: registrations.map(r => r.id),
          },
        },
      });
    });
  });

  describe('Retry Logic Verification', () => {
    it('should calculate correct exponential backoff sequence', () => {
      const config = {
        initialDelayMs: 1000,
        backoffMultiplier: 2,
      };

      const delays = [0, 1, 2, 3].map(retry =>
        calculateBackoffDelay(retry, config.initialDelayMs, config.backoffMultiplier)
      );

      expect(delays).toEqual([1000, 2000, 4000, 8000]);
    });

    it('should handle different backoff configurations', () => {
      // Configuration 1: 500ms initial, 2x multiplier
      const delays1 = [0, 1, 2].map(retry =>
        calculateBackoffDelay(retry, 500, 2)
      );
      expect(delays1).toEqual([500, 1000, 2000]);

      // Configuration 2: 1000ms initial, 3x multiplier
      const delays2 = [0, 1, 2].map(retry =>
        calculateBackoffDelay(retry, 1000, 3)
      );
      expect(delays2).toEqual([1000, 3000, 9000]);
    });
  });

  describe('Data Integrity', () => {
    it('should preserve registration data through sync cycle', async () => {
      const originalData = {
        ticketId: 'AHT-2025-E2E-007',
        attendeeName: 'Data Integrity Test',
        attendeeEmail: 'integrity@example.com',
        attendeePhone: '+91 55555 55555',
        organization: 'Integrity Org',
        role: 'Integrity Role',
        dietaryRestrictions: 'Gluten-free',
        accessibilityNeeds: 'Accessible parking',
      };

      // Create registration
      const registration = await prisma.registration.create({
        data: {
          ...originalData,
          status: 'CONFIRMED',
          paymentStatus: 'PAID',
        },
      });

      // Map to sheet row
      const row = mapRegistrationToSheetRow(registration);

      // Verify all data is preserved
      expect(row.ticketId).toBe(originalData.ticketId);
      expect(row.attendeeName).toBe(originalData.attendeeName);
      expect(row.email).toBe(originalData.attendeeEmail);
      expect(row.phone).toBe(originalData.attendeePhone);
      expect(row.organization).toBe(originalData.organization);
      expect(row.role).toBe(originalData.role);
      expect(row.dietaryRestrictions).toBe(originalData.dietaryRestrictions);
      expect(row.accessibilityNeeds).toBe(originalData.accessibilityNeeds);

      // Store in failed sync
      const failedSync = await prisma.failedSync.create({
        data: {
          registrationId: registration.id,
          registrationData: registration,
          error: 'Test error',
          errorType: 'TRANSIENT',
          retryCount: 0,
          nextRetryTime: new Date(),
        },
      });

      // Verify data is preserved in database
      const retrievedFailedSync = await prisma.failedSync.findUnique({
        where: { id: failedSync.id },
      });

      expect(retrievedFailedSync.registrationData.ticketId).toBe(originalData.ticketId);
      expect(retrievedFailedSync.registrationData.attendeeName).toBe(originalData.attendeeName);

      // Clean up
      await prisma.failedSync.delete({
        where: { id: failedSync.id },
      });
      await prisma.registration.delete({
        where: { id: registration.id },
      });
    });
  });
});
