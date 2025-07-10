import { z } from "zod";

export const purchaseIdSchema = z
  .string()
  .length(4, "O ID de Compra deve conter 4 dígitos")
  .regex(
    /^[A-Z0-9]+$/,
    "O ID de compra deve conter apenas letras maiúsculas e números"
  );
