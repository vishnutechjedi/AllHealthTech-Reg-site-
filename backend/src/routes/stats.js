import { Router } from 'express';
import prisma from '../lib/prisma.js';

const router = Router();

// GET /api/stats
router.get('/', async (_req, res, next) => {
  try {
    const [attendees, speakers, agendaItems] = await Promise.all([
      prisma.registration.count({
        where: {
          status: 'CONFIRMED',
          paymentStatus: 'PAID',
        },
      }),
      prisma.speaker.count(),
      prisma.agendaItem.findMany({
        select: { startTime: true },
      }),
    ]);

    const days = new Set(
      agendaItems.map((item) => item.startTime.toISOString().slice(0, 10))
    ).size;

    res.json({
      attendees,
      speakers,
      exhibitors: Number(process.env.EVENT_EXHIBITOR_COUNT ?? 50),
      days,
    });
  } catch (err) {
    next(err);
  }
});

export default router;
