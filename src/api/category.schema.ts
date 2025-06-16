import { z } from "zod";

const CategorySchema = z
  .object({
    NodeId: z.string(),
    NodeLevel: z.number(),
    Description: z.string(),
    UrlFriendlyName: z.string(),
  })
  .transform((obj) => ({
    id: obj.NodeId,
    level: obj.NodeLevel,
    urlName: obj.UrlFriendlyName,
    displayName: obj.Description,
  }));

export const CategoriesDTOSchema = z
  .object({
    Categories: CategorySchema.array(),
  })
  .transform((obj) => ({
    categories: obj.Categories,
  }));

export type CategoriesDTO = z.infer<typeof CategoriesDTOSchema>;
