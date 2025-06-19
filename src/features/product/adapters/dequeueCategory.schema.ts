import { z } from "zod";

export const CategoryMessageSchema = z.object({
  id: z.string(),
  urlName: z.string(),
  displayName: z.string(),
});
