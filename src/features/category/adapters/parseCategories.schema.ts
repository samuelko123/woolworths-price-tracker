import { z } from "zod";

const CategoryDTOSchema = z
  .object({
    NodeId: z.string(),
    Description: z.string(),
    UrlFriendlyName: z.string(),
  })
  .transform((obj) => ({
    id: obj.NodeId,
    urlName: obj.UrlFriendlyName,
    displayName: obj.Description,
  }));

export const CategoriesDTOSchema = z
  .object({
    Categories: CategoryDTOSchema.array(),
  })
  .transform((obj) => (obj.Categories));

export type CategoriesDTO = z.infer<typeof CategoriesDTOSchema>;
