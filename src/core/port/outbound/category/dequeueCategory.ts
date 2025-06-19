import { Category } from "@/domain";

type DequeueResult = {
  category: Category;
  acknowledge: () => Promise<void>;
};

export type DequeueCategory = () => Promise<DequeueResult | null>;

