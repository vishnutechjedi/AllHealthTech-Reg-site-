import '../src/config/env.js';
import prisma from '../src/lib/prisma.js';
import { syncRegistrationToSheets } from '../src/services/googleSheetsService.js';

const args = new Set(process.argv.slice(2));
const includeConfirmedPaid = args.has('--include-confirmed-paid');

function requireGoogleSheetsConfig() {
  const config = {
    spreadsheetId: process.env.GOOGLE_SHEETS_ID,
    sheetName: process.env.GOOGLE_SHEETS_SHEET_NAME || 'Registrations',
    credentialsPath: process.env.GOOGLE_SHEETS_CREDENTIALS_PATH,
  };

  if (!config.spreadsheetId || !config.credentialsPath) {
    throw new Error('GOOGLE_SHEETS_ID and GOOGLE_SHEETS_CREDENTIALS_PATH must be configured');
  }

  return config;
}

async function syncPayload(label, id, registrationData, googleSheetsConfig) {
  await syncRegistrationToSheets(registrationData, googleSheetsConfig);
  console.log(`[RecoverSheets] Synced ${label}`, {
    id,
    registrationId: registrationData.id,
    ticketId: registrationData.ticketId,
  });
}

async function recoverFailedSyncs(googleSheetsConfig) {
  const failedSyncs = await prisma.failedSync.findMany({
    orderBy: { createdAt: 'asc' },
  });

  for (const failedSync of failedSyncs) {
    await syncPayload('failed sync', failedSync.id, failedSync.registrationData, googleSheetsConfig);
    await prisma.failedSync.delete({ where: { id: failedSync.id } });
  }

  return failedSyncs.length;
}

async function recoverDeadLetters(googleSheetsConfig) {
  const deadLetters = await prisma.deadLetterSync.findMany({
    orderBy: { createdAt: 'asc' },
  });

  for (const deadLetter of deadLetters) {
    await syncPayload('dead letter', deadLetter.id, deadLetter.registrationData, googleSheetsConfig);
    await prisma.deadLetterSync.delete({ where: { id: deadLetter.id } });
  }

  return deadLetters.length;
}

async function recoverConfirmedPaidRegistrations(googleSheetsConfig) {
  const registrations = await prisma.registration.findMany({
    where: {
      status: 'CONFIRMED',
      paymentStatus: 'PAID',
    },
    orderBy: { createdAt: 'asc' },
  });

  for (const registration of registrations) {
    await syncPayload('confirmed paid registration', registration.id, registration, googleSheetsConfig);
  }

  return registrations.length;
}

async function main() {
  const googleSheetsConfig = requireGoogleSheetsConfig();

  const failedCount = await recoverFailedSyncs(googleSheetsConfig);
  const deadLetterCount = await recoverDeadLetters(googleSheetsConfig);
  const confirmedPaidCount = includeConfirmedPaid
    ? await recoverConfirmedPaidRegistrations(googleSheetsConfig)
    : 0;

  console.log('[RecoverSheets] Complete', {
    failedSyncsRecovered: failedCount,
    deadLettersRecovered: deadLetterCount,
    confirmedPaidSynced: confirmedPaidCount,
    includeConfirmedPaid,
  });
}

main()
  .catch((error) => {
    console.error('[RecoverSheets] Failed:', error.message);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
