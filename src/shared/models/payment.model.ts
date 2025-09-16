import z from 'zod';

export const PaymentTransactionSchema = z.object({
  id: z.number().int(),
  gateway: z.string(),
  transactionDate: z.date(),
  accountNumber: z.string(),
  code: z.string().nullable(),
  content: z.string(),
  amountIn: z.number().int(),
  accumulated: z.string(), // Decimal is represented as string
  subAccount: z.string().nullable(),
  transactionContent: z.string(),
  referenceNumber: z.number().int(),
  description: z.string(),
  status: z.enum(['PENDING', 'COMPLETED', 'FAILED']),
  orderId: z.number().int(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const SePayTransactionSchema = z.object({
  id: z.number().int().positive(),

  gateway: z.string().min(1),

  transactionDate: z.string().datetime(),
  accountNumber: z.string().min(1),

  code: z.string().nullable(),
  content: z.string(),

  transferType: z
    .enum(['in', 'out'])
    .describe('Loại giao dịch. in là tiền vào, out là tiền ra'),

  transferAmount: z.number().int().positive(),

  accumulated: z.number().int(),

  subAccount: z.string().nullable(),
  referenceCode: z.string().min(1),

  description: z.string(),
});
