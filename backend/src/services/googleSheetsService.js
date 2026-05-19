import { google } from 'googleapis';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/**
 * Custom error classes for Google Sheets sync
 */
export class TransientSyncError extends Error {
  constructor(message) {
    super(message);
    this.name = 'TransientSyncError';
    this.isTransient = true;
  }
}

export class PermanentSyncError extends Error {
  constructor(message) {
    super(message);
    this.name = 'PermanentSyncError';
    this.isTransient = false;
  }
}

export const REGISTRATION_SHEET_HEADERS = [
  'Ticket ID',
  'Attendee Name',
  'Email',
  'Phone',
  'Organization',
  'Role',
  'Dietary Restrictions',
  'Accessibility Needs',
  'Registration Timestamp',
];

export const REGISTRATION_SHEET_COLUMNS = [
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

/**
 * Get authenticated Google Sheets client
 * @param {string} credentialsPath - Path to service account credentials JSON file
 * @returns {Promise<Object>} Authenticated sheets API client
 */
async function getGoogleSheetsAuth(credentialsPath) {
  try {
    let credentials;
    if (process.env.GOOGLE_SHEETS_CREDENTIALS_JSON) {
      credentials = JSON.parse(process.env.GOOGLE_SHEETS_CREDENTIALS_JSON);
    } else {
      credentials = JSON.parse(fs.readFileSync(credentialsPath, 'utf8'));
    }
    const auth = new google.auth.GoogleAuth({
      credentials,
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });
    return auth;
  } catch (error) {
    throw new PermanentSyncError(`Failed to load Google Sheets credentials: ${error.message}`);
  }
}

function formatRegistrationTimestamp(createdAt) {
  if (!createdAt) {
    return new Date().toISOString();
  }

  if (createdAt instanceof Date) {
    return createdAt.toISOString();
  }

  const parsedDate = new Date(createdAt);
  if (Number.isNaN(parsedDate.getTime())) {
    throw new PermanentSyncError(`Invalid registration timestamp: ${createdAt}`);
  }

  return parsedDate.toISOString();
}

/**
 * Map registration data to Google Sheets row format
 * @param {Object} registration - Registration object from database
 * @returns {Object} Mapped row data
 */
export function mapRegistrationToSheetRow(registration) {
  return {
    ticketId: registration.ticketId,
    attendeeName: registration.attendeeName,
    email: registration.attendeeEmail,
    phone: registration.attendeePhone,
    organization: registration.organization || '',
    role: registration.role || '',
    dietaryRestrictions: registration.dietaryRestrictions || '',
    accessibilityNeeds: registration.accessibilityNeeds || '',
    registrationTimestamp: formatRegistrationTimestamp(registration.createdAt),
  };
}

export function mapRegistrationToSheetValues(registration) {
  const sheetRow = mapRegistrationToSheetRow(registration);
  return REGISTRATION_SHEET_COLUMNS.map((column) => sheetRow[column]);
}

/**
 * Determine if an error is transient or permanent
 * @param {Error} error - The error to classify
 * @returns {boolean} true if transient, false if permanent
 */
function isTransientError(error) {
  // Network errors are transient
  if (error.code === 'ENOTFOUND' || error.code === 'ETIMEDOUT' || error.code === 'ECONNREFUSED') {
    return true;
  }

  // HTTP status codes
  if (error.status) {
    // 429 = Rate limit (transient)
    if (error.status === 429) {
      return true;
    }

    // 5xx = Server errors (transient)
    if (error.status >= 500) {
      return true;
    }

    // 401/403 = Auth errors (permanent)
    if (error.status === 401 || error.status === 403) {
      return false;
    }

    // 404 = Not found (permanent)
    if (error.status === 404) {
      return false;
    }
  }

  // Timeout errors are transient
  if (error.message && error.message.includes('timeout')) {
    return true;
  }

  // Default to transient for unknown errors
  return true;
}

/**
 * Sync a registration to Google Sheets
 * @param {Object} registration - Registration object with event and ticketType relations
 * @param {Object} config - Configuration object
 * @param {string} config.spreadsheetId - Google Sheets spreadsheet ID
 * @param {string} config.sheetName - Sheet name (default: "Registrations")
 * @param {string} config.credentialsPath - Path to service account credentials
 * @returns {Promise<void>}
 * @throws {TransientSyncError} If error is transient and should be retried
 * @throws {PermanentSyncError} If error is permanent and should not be retried
 */
export async function syncRegistrationToSheets(registration, config) {
  const {
    spreadsheetId,
    sheetName = 'Registrations',
    credentialsPath,
  } = config;

  try {
    // Step 1: Authenticate with Google Sheets API
    const auth = await getGoogleSheetsAuth(credentialsPath);
    const sheets = google.sheets({ version: 'v4', auth });

    // Step 2: Map registration data to sheet row
    // Step 3: Prepare values for append
    const values = [mapRegistrationToSheetValues(registration)];

    // Step 4: Append row to sheet
    const response = await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: `${sheetName}!A:I`,
      valueInputOption: 'USER_ENTERED',
      resource: { values },
    });

    // Step 5: Verify append was successful
    if (!response.data.updates || response.data.updates.updatedRows === 0) {
      throw new Error('Failed to append row to sheet');
    }

    // Step 6: Log successful sync
    console.log('[GoogleSheets] Registration synced successfully', {
      registrationId: registration.id,
      ticketId: registration.ticketId,
      updatedRows: response.data.updates.updatedRows,
    });
  } catch (error) {
    // Classify error and throw appropriate error type
    if (isTransientError(error)) {
      throw new TransientSyncError(error.message);
    } else {
      throw new PermanentSyncError(error.message);
    }
  }
}

/**
 * Initialize Google Sheets with headers if needed
 * @param {Object} config - Configuration object
 * @returns {Promise<void>}
 */
export async function initializeGoogleSheet(config) {
  const {
    spreadsheetId,
    sheetName = 'Registrations',
    credentialsPath,
  } = config;

  try {
    const auth = await getGoogleSheetsAuth(credentialsPath);
    const sheets = google.sheets({ version: 'v4', auth });

    // Check if sheet has headers
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: `${sheetName}!A1:K1`,
    });

    const headers = response.data.values?.[0];
    const expectedHeaders = REGISTRATION_SHEET_HEADERS;
    const headersMatch =
      headers &&
      headers.length === expectedHeaders.length &&
      expectedHeaders.every((header, index) => headers[index] === header);

    // If headers don't exist or don't match, add them
    if (!headersMatch) {
      await sheets.spreadsheets.values.update({
        spreadsheetId,
        range: `${sheetName}!A1:I1`,
        valueInputOption: 'USER_ENTERED',
        resource: { values: [expectedHeaders] },
      });

      await sheets.spreadsheets.values.clear({
        spreadsheetId,
        range: `${sheetName}!J1:K1`,
      });

      console.log('[GoogleSheets] Sheet headers initialized');
    }
  } catch (error) {
    console.error('[GoogleSheets] Failed to initialize sheet:', error.message);
    throw error;
  }
}
