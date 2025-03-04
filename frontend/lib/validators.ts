import { z } from "zod";

export const taskSchema = z.object({
  title: z.string().min(2).max(35),
  description: z.string().min(2).max(150),
});
