import { z } from "zod";

export const CategoryMessageSchema = z.object({
  id: z.string(),
  level: z.number(),
  urlName: z.string(),
  displayName: z.string(),
});

