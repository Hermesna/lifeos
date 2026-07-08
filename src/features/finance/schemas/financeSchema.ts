import { z } from "zod";

export const financeSchema = z.object({
  amount: z
    .number({ message: "Amount is required" })
    .positive("The amount must be greater than 0")
    .max(100000, "That seems like an unrealistic transaction for now"),
  description: z
    .string()
    .min(3, "Description must be at least 3 characters long")
    .max(50, "Description is too long"),
  type: z.enum(["income", "expense"], {
    message: "Please select a transaction type",
  }),
});

export type FinanceFormValues = z.infer<typeof financeSchema>;
