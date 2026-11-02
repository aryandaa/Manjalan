import { z } from 'zod';

export const budgetRequestSchema = z.object({
  destinationId: z.string().min(1, 'Destinasi wajib dipilih').max(100),
  origin: z.string().min(1, 'Titik keberangkatan wajib dipilih').max(100),
  guests: z.number().int().min(1).max(20),
  durationDays: z.number().int().min(1).max(14),
  style: z.enum(['hemat', 'standar', 'eksklusif']),
});

export type BudgetRequestInput = z.infer<typeof budgetRequestSchema>;

export const partnerLoginSchema = z.object({
  merchantId: z
    .string()
    .trim()
    .min(3, 'Nomor HP atau ID Mitra minimal 3 karakter')
    .max(50, 'Nomor HP atau ID Mitra maksimal 50 karakter'),
  pin: z.string().regex(/^\d{6}$/, 'PIN wajib 6 digit angka'),
  role: z.enum(['umkm', 'pengelola']),
});

export type PartnerLoginInput = z.infer<typeof partnerLoginSchema>;

export const syncQueueItemSchema = z.object({
  id: z.string().min(1).max(100),
  type: z.enum(['budget_plan', 'feedback', 'partner_update']),
  payload: z.record(z.string().max(100), z.any()),
  timestamp: z.string().max(50),
});

export const syncPayloadSchema = z.object({
  clientVersion: z.string().max(20).default('1.0.0'),
  deviceId: z.string().max(100).optional(),
  queue: z.array(syncQueueItemSchema).max(50, 'Maksimal 50 item per operasi sinkronisasi'),
});

export type SyncPayloadInput = z.infer<typeof syncPayloadSchema>;

export const umkmSubmitSchema = z.object({
  destinationId: z.string().min(1).max(100),
  name: z.string().trim().min(2, 'Nama UMKM minimal 2 karakter').max(100, 'Nama UMKM maksimal 100 karakter'),
  ownerName: z.string().trim().max(100).optional(),
  category: z.enum(['kuliner', 'kelotok', 'souvenir', 'transport']),
  description: z.string().trim().min(5, 'Deskripsi minimal 5 karakter').max(1000, 'Deskripsi maksimal 1000 karakter'),
  priceRange: z.string().trim().min(2).max(100),
  hasQris: z.boolean().default(false),
  hasTransfer: z.boolean().default(true),
  needsCash: z.boolean().default(true),
  whatsapp: z
    .string()
    .trim()
    .max(30)
    .regex(/^(\+?[0-9\s-]{8,20})?$/, 'Nomor WhatsApp tidak valid')
    .optional(),
  offlineNotes: z.string().trim().max(500).optional(),
});

export type UmkmSubmitInput = z.infer<typeof umkmSubmitSchema>;
