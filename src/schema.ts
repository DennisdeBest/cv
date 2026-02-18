import { z } from "zod";

const experienceSchema = z.object({
  title: z.string(),
  meta: z.string(),
  tagline: z.string().optional(),
  items: z.array(z.string()),
  tech: z.array(z.string()).optional(),
});

const educationSchema = z.object({
  label: z.string(),
  detail: z.string(),
});

const sectionsSchema = z.object({
  summary: z.string(),
  experience: z.string(),
  education: z.string(),
  languages: z.string(),
  personal_projects: z.string(),
});

export const cvDataSchema = z.object({
  name: z.string(),
  title: z.string(),
  location: z.string(),
  email: z.string(),
  phone: z.string(),
  linkedin: z.string(),
  website: z.string(),
  avatar: z.string(),
  summary: z.string(),
  experience: z.array(experienceSchema),
  education: z.array(educationSchema),
  languages: z.array(z.string()),
  personal_projects: z.array(z.string()),
  sections: sectionsSchema,
});

export type Experience = z.infer<typeof experienceSchema>;
export type Education = z.infer<typeof educationSchema>;
export type CVData = z.infer<typeof cvDataSchema>;
