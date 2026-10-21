import { z } from "zod";
import { COVER_TONES, PROJECT_STATUSES } from "./types";

export const contactSchema = z.object({
  name: z.string().trim().min(2, "Укажите имя").max(80),
  email: z.email("Некорректный email"),
  company: z.string().trim().max(80).optional().or(z.literal("")),
  body: z.string().trim().min(10, "Сообщение слишком короткое").max(2000),
});

export const loginSchema = z.object({
  password: z.string().min(1, "Введите пароль"),
});

export const projectSchema = z.object({
  title: z.string().trim().min(2).max(80),
  slug: z
    .string()
    .trim()
    .min(2)
    .max(80)
    .regex(/^[a-z0-9-]+$/, "Только латиница, цифры и дефис"),
  summary: z.string().trim().min(10).max(180),
  description: z.string().trim().min(20).max(4000),
  stack: z.string().trim().min(2).max(240),
  status: z.enum(PROJECT_STATUSES),
  year: z.coerce.number().int().min(2018).max(2035),
  repoUrl: z.string().trim().url().optional().or(z.literal("")),
  liveUrl: z.string().trim().optional().or(z.literal("")),
  featured: z.boolean().default(false),
  coverTone: z.enum(COVER_TONES).default("ember"),
  pictures: z.array(z.string()).default([]), // новое поле
});
