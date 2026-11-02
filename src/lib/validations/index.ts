import { z } from 'zod';

export const budgetRequestSchema = z.object({
  destinationId: z.string().min(1, 'Destinasi wajib dipilih'),
  origin: z.string().min(1, 'Titik keberangkatan wajib dipilih'),
  guests: z.number().int().min(1).max(20),
  durationDays: z.number().int().min(1).max(14),
  style: z.enum(['hemat', 'standar', 'eksklusif']),
});

export type BudgetRequestInput = z.infer<typeof budgetRequestSchema>;

export const partnerLoginSchema = z.object({
  merchantId: z.string().min(3, 'Nomor HP atau ID Mitra minimal 3 karakter'),
  pin: z.string().regex(/^\d{6}$/, 'PIN wajib 6 digit angka'),
  role: z.enum(['umkm', 'pengelola']),
});

export type PartnerLoginInput = z.infer<typeof partnerLoginSchema>;

export const syncQueueItemSchema = z.object({
  id: z.string(),
  type: z.enum(['budget_plan', 'feedback', 'partner_update']),
  payload: z.record(z.string(), z.any()),
  timestamp: z.string(),
});

export const syncPayloadSchema = z.object({
  clientVersion: z.string().default('1.0.0'),
  deviceId: z.string().optional(),
  queue: z.array(syncQueueItemSchema),
});

export type SyncPayloadInput = z.infer<typeof syncPayloadSchema>;

export const umkmSubmitSchema = z.object({
  destinationId: z.string().min(1),
  name: z.string().min(2),
  ownerName: z.string().optional(),
  category: z.enum(['kuliner', 'kelotok', 'souvenir', 'transport']),
  description: z.string().min(5),
  priceRange: z.string().min(2),
  hasQris: z.boolean().default(false),
  hasTransfer: z.boolean().default(true),
  needsCash: z.boolean().default(true),
  whatsapp: z.string().optional(),
  offlineNotes: z.string().optional(),
});

export type UmkmSubmitInput = z.infer<typeof umkmSubmitSchema>;
