import { Category } from "@/domain";

export type EnqueueCategories = (category: Category[]) => Promise<void>;
