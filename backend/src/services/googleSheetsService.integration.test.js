import { describe, it, expect, afterAll } from 'vitest';
import prisma from '../lib/prisma.js';
import { mapRegistrationToSheetRow } from './googleSheetsService.js';

describe('Google Sheets Service Integration Tests', () => {
  afterAll(async () => {
    // Clean up test data
    await prisma.registration.deleteMany({
      where: { 
        ticketId: { 
          startsWith: 'AHT-2025-' 
        } 
      },
    });
    await prisma.$disconnect();
  });

  describe('Data Mapping with Database Records', () => {
    it('should map registration from database to sheet row', async () => {
      // Create a registration in the database
      const registration = await prisma.registration.create({
        data: {
          ticketId: 'AHT-2025-00001',
          attendeeName: 'Test User',
          attendeeEmail: 'test@example.com',
          attendeePhone: '+91 98765 43210',
          organization: 'Test Org',
          role: 'Test Role',
          dietaryRestrictions: 'Vegetarian',
          accessibilityNeeds: 'None',
          status: 'CONFIRMED',
          paymentStatus: 'PAID',
        },
      });

      const row = mapRegistrationToSheetRow(registration);

      expect(row.ticketId).toBe('AHT-2025-00001');
      expect(row.attendeeName).toBe('Test User');
      expect(row.email).toBe('test@example.com');
      expect(row.phone).toBe('+91 98765 43210');
      expect(row.organization).toBe('Test Org');
      expect(row.role).toBe('Test Role');
      expect(row.dietaryRestrictions).toBe('Vegetarian');
      expect(row.accessibilityNeeds).toBe('None');

      // Clean up
      await prisma.registration.delete({
        where: { id: registration.id },
      });
    });

    it('should handle registration with minimal data', async () => {
      const registration = await prisma.registration.create({
        data: {
          ticketId: 'AHT-2025-00002',
          attendeeName: 'Minimal User',
          attendeeEmail: 'minimal@example.com',
          attendeePhone: '1234567890',
          status: 'CONFIRMED',
          paymentStatus: 'PAID',
        },
      });

      const row = mapRegistrationToSheetRow(registration);

      expect(row.ticketId).toBe('AHT-2025-00002');
      expect(row.attendeeName).toBe('Minimal User');
      expect(row.email).toBe('minimal@example.com');
      expect(row.phone).toBe('1234567890');
      expect(row.organization).toBe('');
      expect(row.role).toBe('');
      expect(row.dietaryRestrictions).toBe('');
      expect(row.accessibilityNeeds).toBe('');

      // Clean up
      await prisma.registration.delete({
        where: { id: registration.id },
      });
    });

    it('should preserve all 9 columns in correct order', async () => {
      const registration = await prisma.registration.create({
        data: {
          ticketId: 'AHT-2025-00003',
          attendeeName: 'Order Test',
          attendeeEmail: 'order@example.com',
          attendeePhone: '9876543210',
          organization: 'Order Org',
          role: 'Order Role',
          dietaryRestrictions: 'Order Diet',
          accessibilityNeeds: 'Order Access',
          status: 'CONFIRMED',
          paymentStatus: 'PAID',
        },
      });

      const row = mapRegistrationToSheetRow(registration);

      const expectedOrder = [
        'ticketId',
        'attendeeName',
        'email',
        'phone',
        'organization',
        'role',
        'dietaryRestrictions',
        'accessibilityNeeds',
        'registrationTimestamp',
      ];

      const actualOrder = Object.keys(row);
      expect(actualOrder).toEqual(expectedOrder);
      expect(actualOrder.length).toBe(9);

      // Clean up
      await prisma.registration.delete({
        where: { id: registration.id },
      });
    });
  });

  describe('Failed Sync Database Operations', () => {
    it('should create a failed sync record', async () => {
      const registration = await prisma.registration.create({
        data: {
          ticketId: 'AHT-2025-00004',
          attendeeName: 'Failed Sync Test',
          attendeeEmail: 'failed@example.com',
          attendeePhone: '5555555555',
          status: 'CONFIRMED',
          paymentStatus: 'PAID',
        },
      });

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

      expect(failedSync).toBeDefined();
      expect(failedSync.registrationId).toBe(registration.id);
      expect(failedSync.errorType).toBe('TRANSIENT');
      expect(failedSync.retryCount).toBe(0);

      // Clean up
      await prisma.failedSync.delete({
        where: { id: failedSync.id },
      });
      await prisma.registration.delete({
        where: { id: registration.id },
      });
    });

    it('should move failed sync to dead letter queue', async () => {
      const registration = await prisma.registration.create({
        data: {
          ticketId: 'AHT-2025-00005',
          attendeeName: 'Dead Letter Test',
          attendeeEmail: 'deadletter@example.com',
          attendeePhone: '4444444444',
          status: 'CONFIRMED',
          paymentStatus: 'PAID',
        },
      });

      const deadLetterSync = await prisma.deadLetterSync.create({
        data: {
          registrationId: registration.id,
          registrationData: registration,
          error: 'Permanent error',
          errorType: 'PERMANENT',
          retryCount: 3,
          lastAttemptTime: new Date(),
        },
      });

      expect(deadLetterSync).toBeDefined();
      expect(deadLetterSync.registrationId).toBe(registration.id);
      expect(deadLetterSync.errorType).toBe('PERMANENT');
      expect(deadLetterSync.retryCount).toBe(3);

      // Clean up
      await prisma.deadLetterSync.delete({
        where: { id: deadLetterSync.id },
      });
      await prisma.registration.delete({
        where: { id: registration.id },
      });
    });

    it('should query failed syncs by next retry time', async () => {
      const registration = await prisma.registration.create({
        data: {
          ticketId: 'AHT-2025-00006',
          attendeeName: 'Query Test',
          attendeeEmail: 'query@example.com',
          attendeePhone: '3333333333',
          status: 'CONFIRMED',
          paymentStatus: 'PAID',
        },
      });

      const now = new Date();
      const pastTime = new Date(now.getTime() - 60000); // 1 minute ago

      const failedSync = await prisma.failedSync.create({
        data: {
          registrationId: registration.id,
          registrationData: registration,
          error: 'Test error',
          errorType: 'TRANSIENT',
          retryCount: 1,
          nextRetryTime: pastTime,
        },
      });

      // Query for syncs ready to retry
      const readyForRetry = await prisma.failedSync.findMany({
        where: {
          nextRetryTime: {
            lte: now,
          },
        },
      });

      expect(readyForRetry.length).toBeGreaterThan(0);
      expect(readyForRetry.some(s => s.id === failedSync.id)).toBe(true);

      // Clean up
      await prisma.failedSync.delete({
        where: { id: failedSync.id },
      });
      await prisma.registration.delete({
        where: { id: registration.id },
      });
    });
  });

  describe('Timestamp Handling', () => {
    it('should format timestamp as ISO 8601', async () => {
      const testDate = new Date('2025-10-15T10:30:45.123Z');
      const registration = await prisma.registration.create({
        data: {
          ticketId: 'AHT-2025-00007',
          attendeeName: 'Timestamp Test',
          attendeeEmail: 'timestamp@example.com',
          attendeePhone: '2222222222',
          status: 'CONFIRMED',
          paymentStatus: 'PAID',
          createdAt: testDate,
        },
      });

      const row = mapRegistrationToSheetRow(registration);

      expect(row.registrationTimestamp).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/);
      expect(row.registrationTimestamp).toContain('Z');

      // Clean up
      await prisma.registration.delete({
        where: { id: registration.id },
      });
    });
  });
});
