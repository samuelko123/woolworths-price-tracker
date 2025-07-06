import { z } from "zod";

import { type Category } from "@/features/category";

const WoolworthsCategorySchema = z.object({
  NodeId: z.string(),
  Description: z.string(),
  UrlFriendlyName: z.string(),
});

export const WoolworthsCategoriesResponseSchema = z
  .object({
    Categories: WoolworthsCategorySchema.array(),
  })
  .transform((obj): Category[] => {
    return obj.Categories.map((c): Category => ({
      id: c.NodeId,
      urlName: c.UrlFriendlyName,
      displayName: c.Description,
    }));
  });
