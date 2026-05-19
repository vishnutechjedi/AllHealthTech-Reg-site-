import { syncRegistrationToSheets } from './src/services/googleSheetsService.js';

// Load environment variables manually
process.env.GOOGLE_SHEETS_ID = '1-s9yQZJNo7gwCFvoFQgmQhchmveNNgQz4VKF6oSlWag';
process.env.GOOGLE_SHEETS_SHEET_NAME = 'Sheet1';
process.env.GOOGLE_SHEETS_CREDENTIALS_PATH = './credentials/google-sheets-credentials.json';

// Test registration data.
const testRegistration = {
  id: 'test-id',
  ticketId: 'AHT-2026-TEST',
  attendeeName: 'Test User',
  attendeeEmail: 'test@example.com',
  attendeePhone: '+91 98765 43210',
  organization: 'Test Org',
  role: 'Tester',
  dietaryRestrictions: 'None',
  accessibilityNeeds: 'None',
  ticketType: {
    name: 'General Admission',
  },
  event: {
    name: 'AllHealthTech 2026',
  },
  createdAt: new Date(),
};

const googleSheetsConfig = {
  spreadsheetId: process.env.GOOGLE_SHEETS_ID,
  sheetName: process.env.GOOGLE_SHEETS_SHEET_NAME || 'Registrations',
  credentialsPath: process.env.GOOGLE_SHEETS_CREDENTIALS_PATH,
};

console.log('Testing Google Sheets sync...');
console.log('Config:', googleSheetsConfig);

try {
  await syncRegistrationToSheets(testRegistration, googleSheetsConfig);
  console.log('✅ Sync successful!');
} catch (error) {
  console.error('❌ Sync failed:', error.message);
  console.error('Error details:', error);
}
