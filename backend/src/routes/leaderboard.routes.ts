import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();
const prisma = new PrismaClient();

router.get('/', authMiddleware, async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        username: true,
        firstName: true,
        photoUrl: true,
        casesOpened: true,
        totalEarned: true,
        totalSpent: true,
      },
      orderBy: {
        totalEarned: 'desc',
      },
      take: 100,
    });

    const leaderboard = users.map((user, index) => ({
      rank: index + 1,
      id: user.id,
      username: user.username || user.firstName || 'Anonymous',
      photoUrl: user.photoUrl,
      casesOpened: user.casesOpened,
      totalEarned: user.totalEarned,
      profit: user.totalEarned - user.totalSpent,
    }));

    res.json(leaderboard);
  } catch (error) {
    console.error('Get leaderboard error:', error);
    res.status(500).json({ error: 'Failed to fetch leaderboard' });
  }
});

export default router;
