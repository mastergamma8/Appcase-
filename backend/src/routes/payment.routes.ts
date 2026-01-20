import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { authMiddleware } from '../middleware/auth.middleware';
import TelegramBot from 'node-telegram-bot-api';

const router = Router();
const prisma = new PrismaClient();
const bot = new TelegramBot(process.env.BOT_TOKEN || '', { polling: false });

router.post('/create-invoice', authMiddleware, async (req, res) => {
  try {
    const { amount } = req.body;
    const userId = req.user!.userId;
    const telegramId = req.user!.telegramId;

    if (!amount || amount < 1) {
      return res.status(400).json({ error: 'Invalid amount' });
    }

    const title = `Пополнение баланса`;
    const description = `Пополнение на ${amount} ⭐️ Stars`;
    const payload = JSON.stringify({ userId, amount, timestamp: Date.now() });

    const prices = [{ label: 'Stars', amount }];

    const invoiceLink = await bot.createInvoiceLink(
      title,
      description,
      payload,
      '',
      'XTR',
      prices
    );

    res.json({ invoiceLink });
  } catch (error) {
    console.error('Create invoice error:', error);
    res.status(500).json({ error: 'Failed to create invoice' });
  }
});

router.post('/webhook', async (req, res) => {
  try {
    const update = req.body;

    if (update.pre_checkout_query) {
      await bot.answerPreCheckoutQuery(update.pre_checkout_query.id, true);
    }

    if (update.message?.successful_payment) {
      const payment = update.message.successful_payment;
      const payload = JSON.parse(payment.invoice_payload);

      await prisma.$transaction([
        prisma.user.update({
          where: { id: payload.userId },
          data: {
            balance: { increment: payload.amount },
          },
        }),
        prisma.transaction.create({
          data: {
            userId: payload.userId,
            type: 'deposit',
            amount: payload.amount,
            description: `Deposit ${payload.amount} Stars`,
          },
        }),
      ]);

      await bot.sendMessage(
        update.message.from.id,
        `✅ Ваш баланс пополнен на ${payload.amount} ⭐️ Stars!`
      );
    }

    res.status(200).json({ ok: true });
  } catch (error) {
    console.error('Webhook error:', error);
    res.status(500).json({ error: 'Webhook processing failed' });
  }
});

export default router;
