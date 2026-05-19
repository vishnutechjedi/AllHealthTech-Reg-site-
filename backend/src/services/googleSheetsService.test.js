import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  mapRegistrationToSheetRow,
  mapRegistrationToSheetValues,
  TransientSyncError,
  PermanentSyncError,
} from './googleSheetsService.js';

describe('Google Sheets Service', () => {
  describe('mapRegistrationToSheetRow', () => {
    it('should map all registration fields to sheet row', () => {
      const registration = {
        ticketId: 'AHT-2025-00001',
        attendeeName: 'John Doe',
        attendeeEmail: 'john@example.com',
        attendeePhone: '+91 98765 43210',
        organization: 'Acme Corp',
        role: 'Manager',
        dietaryRestrictions: 'Vegetarian',
        accessibilityNeeds: 'Wheelchair access',
        createdAt: new Date('2025-10-01T14:30:00Z'),
      };

      const row = mapRegistrationToSheetRow(registration);

      expect(row.ticketId).toBe('AHT-2025-00001');
      expect(row.attendeeName).toBe('John Doe');
      expect(row.email).toBe('john@example.com');
      expect(row.phone).toBe('+91 98765 43210');
      expect(row.organization).toBe('Acme Corp');
      expect(row.role).toBe('Manager');
      expect(row.dietaryRestrictions).toBe('Vegetarian');
      expect(row.accessibilityNeeds).toBe('Wheelchair access');
      expect(row.registrationTimestamp).toBe('2025-10-01T14:30:00.000Z');
    });

    it('should handle missing optional fields', () => {
      const registration = {
        ticketId: 'AHT-2025-00002',
        attendeeName: 'Jane Smith',
        attendeeEmail: 'jane@example.com',
        attendeePhone: '+91 87654 32109',
        organization: undefined,
        role: undefined,
        dietaryRestrictions: undefined,
        accessibilityNeeds: undefined,
        createdAt: new Date('2025-10-01T15:00:00Z'),
      };

      const row = mapRegistrationToSheetRow(registration);

      expect(row.organization).toBe('');
      expect(row.role).toBe('');
      expect(row.dietaryRestrictions).toBe('');
      expect(row.accessibilityNeeds).toBe('');
    });

    it('should handle missing ticketType and event (no longer applicable)', () => {
      const registration = {
        ticketId: 'AHT-2025-00003',
        attendeeName: 'Bob Johnson',
        attendeeEmail: 'bob@example.com',
        attendeePhone: '+91 76543 21098',
        organization: 'Tech Inc',
        role: 'Developer',
        dietaryRestrictions: 'Vegan',
        accessibilityNeeds: undefined,
        createdAt: new Date('2025-10-01T16:00:00Z'),
      };

      const row = mapRegistrationToSheetRow(registration);

      // ticketType and eventName fields no longer exist
      expect(row.ticketType).toBeUndefined();
      expect(row.eventName).toBeUndefined();
    });

    it('should format timestamp as ISO 8601', () => {
      const registration = {
        ticketId: 'AHT-2025-00004',
        attendeeName: 'Alice Brown',
        attendeeEmail: 'alice@example.com',
        attendeePhone: '+91 65432 10987',
        organization: undefined,
        role: undefined,
        dietaryRestrictions: undefined,
        accessibilityNeeds: undefined,
        createdAt: new Date('2025-10-15T10:30:45.123Z'),
      };

      const row = mapRegistrationToSheetRow(registration);

      expect(row.registrationTimestamp).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/);
      expect(row.registrationTimestamp).toBe('2025-10-15T10:30:45.123Z');
    });

    it('should handle JSON-restored createdAt strings from retry payloads', () => {
      const registration = {
        ticketId: 'AHT-2025-00009',
        attendeeName: 'Retry User',
        attendeeEmail: 'retry@example.com',
        attendeePhone: '+91 98765 43210',
        createdAt: '2025-10-15T10:30:45.123Z',
      };

      const row = mapRegistrationToSheetRow(registration);

      expect(row.registrationTimestamp).toBe('2025-10-15T10:30:45.123Z');
    });
  });

  describe('Error Classes', () => {
    it('should create TransientSyncError with correct properties', () => {
      const error = new TransientSyncError('Network timeout');

      expect(error.name).toBe('TransientSyncError');
      expect(error.message).toBe('Network timeout');
      expect(error.isTransient).toBe(true);
      expect(error instanceof Error).toBe(true);
    });

    it('should create PermanentSyncError with correct properties', () => {
      const error = new PermanentSyncError('Authentication failed');

      expect(error.name).toBe('PermanentSyncError');
      expect(error.message).toBe('Authentication failed');
      expect(error.isTransient).toBe(false);
      expect(error instanceof Error).toBe(true);
    });
  });

  describe('Data Mapping Edge Cases', () => {
    it('should handle special characters in fields', () => {
      const registration = {
        ticketId: 'AHT-2025-00005',
        attendeeName: "O'Brien & Associates",
        attendeeEmail: 'test+tag@example.com',
        attendeePhone: '+91 (98765) 43210',
        organization: 'Smith & Co. Ltd.',
        role: 'VP of R&D',
        dietaryRestrictions: 'Gluten-free, Nut-free',
        accessibilityNeeds: 'Sign language interpreter & accessible parking',
        createdAt: new Date('2025-10-01T14:30:00Z'),
      };

      const row = mapRegistrationToSheetRow(registration);

      expect(row.attendeeName).toBe("O'Brien & Associates");
      expect(row.email).toBe('test+tag@example.com');
      expect(row.phone).toBe('+91 (98765) 43210');
      expect(row.organization).toBe('Smith & Co. Ltd.');
      expect(row.role).toBe('VP of R&D');
      expect(row.dietaryRestrictions).toBe('Gluten-free, Nut-free');
      expect(row.accessibilityNeeds).toBe('Sign language interpreter & accessible parking');
    });

    it('should handle very long strings', () => {
      const longString = 'a'.repeat(500);
      const registration = {
        ticketId: 'AHT-2025-00006',
        attendeeName: 'Test User',
        attendeeEmail: 'test@example.com',
        attendeePhone: '+91 98765 43210',
        organization: longString,
        role: longString,
        dietaryRestrictions: longString,
        accessibilityNeeds: longString,
        createdAt: new Date('2025-10-01T14:30:00Z'),
      };

      const row = mapRegistrationToSheetRow(registration);

      expect(row.organization).toBe(longString);
      expect(row.role).toBe(longString);
      expect(row.dietaryRestrictions).toBe(longString);
      expect(row.accessibilityNeeds).toBe(longString);
    });

    it('should handle empty strings for optional fields', () => {
      const registration = {
        ticketId: 'AHT-2025-00007',
        attendeeName: 'Test User',
        attendeeEmail: 'test@example.com',
        attendeePhone: '+91 98765 43210',
        organization: '',
        role: '',
        dietaryRestrictions: '',
        accessibilityNeeds: '',
        createdAt: new Date('2025-10-01T14:30:00Z'),
      };

      const row = mapRegistrationToSheetRow(registration);

      expect(row.organization).toBe('');
      expect(row.role).toBe('');
      expect(row.dietaryRestrictions).toBe('');
      expect(row.accessibilityNeeds).toBe('');
    });

    it('should preserve all 9 columns in correct order', () => {
      const registration = {
        ticketId: 'AHT-2025-00008',
        attendeeName: 'Test User',
        attendeeEmail: 'test@example.com',
        attendeePhone: '+91 98765 43210',
        organization: 'Test Org',
        role: 'Test Role',
        dietaryRestrictions: 'Test Diet',
        accessibilityNeeds: 'Test Access',
        createdAt: new Date('2025-10-01T14:30:00Z'),
      };

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
    });

    it('should produce exactly 9 sheet values without undefined entries', () => {
      const registration = {
        ticketId: 'AHT-2025-00010',
        attendeeName: 'Sheet Values User',
        attendeeEmail: 'sheet-values@example.com',
        attendeePhone: '+91 98765 43210',
        createdAt: '2025-10-01T14:30:00.000Z',
      };

      const values = mapRegistrationToSheetValues(registration);

      expect(values).toHaveLength(9);
      expect(values).not.toContain(undefined);
      expect(values).toEqual([
        'AHT-2025-00010',
        'Sheet Values User',
        'sheet-values@example.com',
        '+91 98765 43210',
        '',
        '',
        '',
        '',
        '2025-10-01T14:30:00.000Z',
      ]);
    });
  });
});
