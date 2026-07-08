import { z } from "zod";

export const habitsSchema = z.object({
  name: z
    .string()
    .min(3, "The habit name must be at least 3 characters long")
    .max(40, "Keep it short and actionable (max 40 characters)"),
  category: z.enum(["work", "health", "languages", "lifestyle"], {
    message: "Please select a valid category",
  }),
});

export type HabitsFormValues = z.infer<typeof habitsSchema>;