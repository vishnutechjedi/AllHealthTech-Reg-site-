import { Router } from 'express';
import {
  REGISTRATION_AMOUNT_PAISE,
  REGISTRATION_CURRENCY,
} from '../services/paymentService.js';

const router = Router();

const currentEvent = {
  id: 'allhealthtech-2026',
  name: 'AllHealthTech 2026',
  date: '2026-10-15T00:00:00.000Z',
  endDate: '2026-10-17T00:00:00.000Z',
  location: 'Bombay Exhibition Centre, Mumbai',
  venue: 'Bombay Exhibition Centre',
  description:
    'India\'s premier health technology conference bringing together healthcare and technology leaders for three days of learning, collaboration, and innovation.',
  bannerUrl: null,
  ticketTypes: [
    {
      id: 'general-admission',
      name: 'General Admission',
      price: REGISTRATION_AMOUNT_PAISE,
      currency: REGISTRATION_CURRENCY,
      description: 'Full conference access for AllHealthTech 2026.',
      features: [
        'Three-day conference access',
        'Keynotes and sessions',
        'Networking opportunities',
      ],
      capacity: null,
      soldCount: null,
      isActive: true,
    },
  ],
};

// GET /api/events/current
router.get('/current', (_req, res) => {
  res.json(currentEvent);
});

export default router;
