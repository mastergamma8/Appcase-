import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();
const prisma = new PrismaClient();

router.get('/profile', authMiddleware, async (req, res) => {
  try {
    const userId = req.user!.userId;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        items: {
          where: { status: 'inventory' },
          include: {
            itemTemplate: true,
          },
        },
      },
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const inventoryValue = user.items.reduce(
      (sum, item) => sum + item.itemTemplate.price,
      0
    );

    res.json({
      id: user.id,
      telegramId: user.telegramId.toString(),
      username: user.username,
      firstName: user.firstName,
      lastName: user.lastName,
      photoUrl: user.photoUrl,
      balance: user.balance,
      totalSpent: user.totalSpent,
      totalEarned: user.totalEarned,
      casesOpened: user.casesOpened,
      inventoryCount: user.items.length,
      inventoryValue,
      profit: user.totalEarned + inventoryValue - user.totalSpent,
      createdAt: user.createdAt,
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
});

router.get('/balance', authMiddleware, async (req, res) => {
  try {
    const userId = req.user!.userId;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { balance: true },
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ balance: user.balance });
  } catch (error) {
    console.error('Get balance error:', error);
    res.status(500).json({ error: 'Failed to fetch balance' });
  }
});

export default router;
