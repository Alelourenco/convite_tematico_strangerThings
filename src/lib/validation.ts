import { z } from "zod";

export const rsvpSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Informe seu nome")
    .min(2, "Nome muito curto")
    .max(80, "Nome muito longo"),
  status: z.enum(["YES", "NO"]),
  bringCompanion: z.boolean().default(false),
  companionName: z
    .string()
    .trim()
    .max(80, "Nome do acompanhante muito longo")
    .optional()
    .or(z.literal("")),
  message: z
    .string()
    .trim()
    .max(280, "Mensagem muito longa")
    .optional()
    .or(z.literal("")),
}).superRefine((val, ctx) => {
  if (val.bringCompanion) {
    if (!val.companionName || val.companionName.trim().length < 2) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Informe o nome do acompanhante",
        path: ["companionName"],
      });
    }
  }
});

export type RsvpInput = z.infer<typeof rsvpSchema>;
