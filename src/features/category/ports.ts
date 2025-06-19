import { Category } from "@/core/domain";

export type FetchCategories = () => Promise<Category[]>;

export type PurgeCategoryQueue = () => Promise<void>;

export type EnqueueCategories = (category: Category[]) => Promise<void>;
