import { z } from "zod";

export const prizeSchema = z.object({
  id: z.string(),
  rank: z.number().min(1),
  name: z.string().min(1, "Prize name required"),
  type: z.enum(["coins", "freeSpin", "bonus"]),
  amount: z
    .number()
    .min(2, "Must be at least 2 participants")
    .positive("Amount must be positive"),
  imageUrl: z.string(),
  // imageUrl: z.string().url("Invalid URL"),
});

export const leaderboardSchema = z
  .object({
    title: z.string().min(3).max(100),
    description: z.string().optional(),
    startDate: z.string(),
    endDate: z.string(),
    status: z.enum(["draft", "active", "completed"]),
    scoringType: z.enum(["points", "wins", "wagered"]),
    maxParticipants: z.number().min(2),
    prizes: z.array(prizeSchema).min(1, "At least 1 prize required"),
  })
  .refine((data) => new Date(data.endDate) > new Date(data.startDate), {
    message: "Start date must be before end date",
    path: ["startDate"],
  })
  .refine((data) => new Date(data.endDate) > new Date(data.startDate), {
    message: "End date must be after start date",
    path: ["endDate"],
  })
  .refine(
    (data) => {
      const ranks = data.prizes.map((p) => p.rank);
      return ranks.every((r, i) => r === i + 1);
    },
    {
      message: "Prize ranks must be sequential starting from 1",
      path: ["prizes"],
    }
  );

export type LeaderboardFormValues = z.infer<typeof leaderboardSchema>;
