import { z } from "zod";

const prizeSchema = z.object({
  id: z.string(),
  name: z.string().min(1, "Prize name required"),
  type: z.enum(["coins", "freeSpin", "bonus"]),
  amount: z.number().nonnegative(),
  quantity: z.number().min(1, "Quantity must be at least 1"),
  imageUrl: z.string(),
});

export const raffleSchema = z
  .object({
    name: z.string().min(3).max(80),
    description: z.string().optional(),
    startDate: z.string(),
    endDate: z.string(),
    drawDate: z.string(),
    status: z.enum(["draft", "active", "drawn", "cancelled"]),
    ticketPrice: z.number().positive(),
    maxTicketsPerUser: z.number().min(1),
    totalTicketLimit: z.number().nullable(),
    prizes: z.array(prizeSchema).min(1),
  })
  .refine((d) => new Date(d.endDate) > new Date(d.startDate), {
    message: "End date must be after start date",
    path: ["endDate"],
  })
  .refine((d) => new Date(d.drawDate) > new Date(d.endDate), {
    message: "Draw date must be after end date",
    path: ["drawDate"],
  });

export type RaffleFormValues = z.infer<typeof raffleSchema>;
