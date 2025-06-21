import { z } from "zod";

export const CategorySchema = z.object({
  id: z.string(),
  urlName: z.string(),
  displayName: z.string(),
}).strict();

export type Category = z.infer<typeof CategorySchema>;
