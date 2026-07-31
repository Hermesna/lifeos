import { z } from "zod";
import type { TFunction } from "i18next";

export const getFinanceSchema = (t: TFunction) =>
  z.object({
    amount: z.coerce
      .number({
        message: t("finance.validation.validNumber", "Introduce un número válido."),
      })
      .positive(
        t("finance.validation.amountPositive", "El importe debe ser mayor que cero.")
      )
      .max(
        100000,
        t("finance.validation.amountMax", "That seems like an unrealistic transaction for now")
      ),
    description: z
      .string()
      .min(
        3,
        t("finance.validation.descriptionMin", "La descripción debe tener al menos 3 caracteres.")
      )
      .max(50, t("finance.validation.descriptionMax", "Description is too long")),
    type: z.enum(["income", "expense"], {
      message: t("finance.validation.selectType", "Please select a transaction type"),
    }),
    category: z
      .string()
      .min(1, t("finance.validation.selectCategory", "Selecciona una categoría.")),
  });

export type FinanceSchemaType = ReturnType<typeof getFinanceSchema>;
export type FinanceFormValues = z.input<FinanceSchemaType>;
export type FinanceFormOutput = z.output<FinanceSchemaType>;