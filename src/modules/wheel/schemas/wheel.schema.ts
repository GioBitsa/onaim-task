import { z } from "zod";

export const segmentSchema = z.object({
  label: z.string().min(1, "Label required"),
  color: z.string().regex(/^#([0-9A-F]{3}){1,2}$/i, "Invalid hex color"),
  weight: z.number().min(1).max(100),
  prizeType: z.enum(["coins", "freeSpin", "bonus", "nothing"]),
  prizeAmount: z.number(),
  imageUrl: z.string(),
});

export const wheelSchema = z
  .object({
    name: z.string().min(3).max(80),
    description: z.string().optional(),
    status: z.enum(["draft", "active", "inactive"]),
    segments: z.array(segmentSchema).min(2).max(12),
    maxSpinsPerUser: z.number().min(1),
    spinCost: z.number().min(0),
    backgroundColor: z.string(),
    borderColor: z.string(),
  })
  .refine(
    (data) => data.segments.reduce((sum, s) => sum + s.weight, 0) === 100,
    {
      message: "Total weight must equal 100",
      path: ["segments"],
    }
  )
  .refine(
    (data) =>
      data.segments.every((s) =>
        s.prizeType === "nothing" ? s.prizeAmount === 0 : s.prizeAmount > 0
      ),
    {
      message: "Invalid prize amount for segment",
      path: ["segments"],
    }
  );

export type WheelFormValues = z.infer<typeof wheelSchema>;
