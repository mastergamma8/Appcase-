import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();
const prisma = new PrismaClient();

router.get('/', authMiddleware, async (req, res) => {
  try {
    const cases = await prisma.case.findMany({
      include: {
        items: {
          include: {
            item: true,
          },
        },
      },
      orderBy: { tier: 'asc' },
    });

    const formattedCases = cases.map(c => ({
      id: c.id,
      key: c.key,
      name: c.name,
      price: c.price,
      image: c.image,
      tier: c.tier,
      items: c.items.map(ci => ({
        ...ci.item,
        dropChance: ci.dropChance,
      })),
    }));

    res.json(formattedCases);
  } catch (error) {
    console.error('Get cases error:', error);
    res.status(500).json({ error: 'Failed to fetch cases' });
  }
});

router.post('/open', authMiddleware, async (req, res) => {
  try {
    const { caseId } = req.body;
    const userId = req.user!.userId;

    const caseData = await prisma.case.findUnique({
      where: { id: caseId },
      include: {
        items: {
          include: {
            item: true,
          },
        },
      },
    });

    if (!caseData) {
      return res.status(404).json({ error: 'Case not found' });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user || user.balance < caseData.price) {
      return res.status(400).json({ error: 'Insufficient balance' });
    }

    const wonItem = determineWinningItem(caseData.items);

    const [updatedUser, newItem, , ] = await prisma.$transaction([
      prisma.user.update({
        where: { id: userId },
        data: {
          balance: { decrement: caseData.price },
          totalSpent: { increment: caseData.price },
          casesOpened: { increment: 1 },
        },
      }),
      prisma.item.create({
        data: {
          userId,
          itemTemplateId: wonItem.item.id,
          status: 'inventory',
        },
        include: {
          itemTemplate: true,
        },
      }),
      prisma.caseOpening.create({
        data: {
          userId,
          caseId,
          itemWonId: wonItem.item.id,
        },
      }),
      prisma.transaction.create({
        data: {
          userId,
          type: 'spend',
          amount: caseData.price,
          description: `Opened ${caseData.name}`,
        },
      }),
    ]);

    const rouletteItems = generateRouletteItems(caseData.items, wonItem.item);

    res.json({
      wonItem: {
        id: newItem.id,
        name: newItem.itemTemplate.name,
        image: newItem.itemTemplate.image,
        rarity: newItem.itemTemplate.rarity,
        price: newItem.itemTemplate.price,
      },
      rouletteItems,
      newBalance: updatedUser.balance,
    });
  } catch (error) {
    console.error('Open case error:', error);
    res.status(500).json({ error: 'Failed to open case' });
  }
});

function determineWinningItem(items: any[]) {
  const random = Math.random();
  let cumulative = 0;

  for (const item of items) {
    cumulative += item.dropChance;
    if (random < cumulative) {
      return item;
    }
  }

  return items[0];
}

function generateRouletteItems(caseItems: any[], wonItem: any, count: number = 70) {
  const items = [];
  const winPosition = 50;

  for (let i = 0; i < count; i++) {
    if (i === winPosition) {
      items.push(wonItem);
    } else {
      const randomItem = caseItems[Math.floor(Math.random() * caseItems.length)];
      items.push(randomItem.item);
    }
  }

  return items;
}

export default router;
