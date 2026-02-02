import { z } from "zod";

export const rsvpSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Informe seu nome")
    .min(2, "Nome muito curto")
    .max(80, "Nome muito longo"),
  phone: z
    .string()
    .trim()
    .max(30, "Telefone muito longo")
    .optional()
    .or(z.literal("")),
  status: z.enum(["YES", "NO", "MAYBE"]),
  additionalQty: z
    .number()
    .int()
    .min(0)
    .max(10),
  message: z
    .string()
    .trim()
    .max(280, "Mensagem muito longa")
    .optional()
    .or(z.literal("")),
});

export type RsvpInput = z.infer<typeof rsvpSchema>;
