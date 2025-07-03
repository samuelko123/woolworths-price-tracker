import { z } from "zod";

import { WoolworthsProductSchema } from "@/integrations/woolworths";

const ProductSchema = WoolworthsProductSchema
  .transform((raw) => ({
    barcode: raw.Barcode,
    sku: String(raw.Stockcode),
    name: raw.DisplayName,
    packageSize: raw.PackageSize,
    imageUrl: raw.MediumImageFile,
    price: raw.Price,
  }));

export const ProductsSchema = z.array(ProductSchema);
