import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();
const prisma = new PrismaClient();

router.get('/', authMiddleware, async (req, res) => {
  try {
    const userId = req.user!.userId;

    const items = await prisma.item.findMany({
      where: {
        userId,
        status: 'inventory',
      },
      include: {
        itemTemplate: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    const formattedItems = items.map(item => ({
      id: item.id,
      name: item.itemTemplate.name,
      image: item.itemTemplate.image,
      rarity: item.itemTemplate.rarity,
      price: item.itemTemplate.price,
      createdAt: item.createdAt,
    }));

    res.json(formattedItems);
  } catch (error) {
    console.error('Get inventory error:', error);
    res.status(500).json({ error: 'Failed to fetch inventory' });
  }
});

router.post('/exchange', authMiddleware, async (req, res) => {
  try {
    const { itemId } = req.body;
    const userId = req.user!.userId;

    const item = await prisma.item.findFirst({
      where: {
        id: itemId,
        userId,
        status: 'inventory',
      },
      include: {
        itemTemplate: true,
      },
    });

    if (!item) {
      return res.status(404).json({ error: 'Item not found' });
    }

    const [updatedUser, updatedItem, ] = await prisma.$transaction([
      prisma.user.update({
        where: { id: userId },
        data: {
          balance: { increment: item.itemTemplate.price },
          totalEarned: { increment: item.itemTemplate.price },
        },
      }),
      prisma.item.update({
        where: { id: itemId },
        data: {
          status: 'exchanged',
          exchangedAt: new Date(),
        },
      }),
      prisma.transaction.create({
        data: {
          userId,
          type: 'earn',
          amount: item.itemTemplate.price,
          description: `Exchanged ${item.itemTemplate.name}`,
        },
      }),
    ]);

    res.json({
      success: true,
      newBalance: updatedUser.balance,
      exchangedAmount: item.itemTemplate.price,
    });
  } catch (error) {
    console.error('Exchange item error:', error);
    res.status(500).json({ error: 'Failed to exchange item' });
  }
});

export default router;
