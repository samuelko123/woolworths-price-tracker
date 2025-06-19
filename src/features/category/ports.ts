import { Category } from "src/domain/category";

export type FetchCategories = () => Promise<Category[]>;

export type PurgeCategoryQueue = () => Promise<void>;

export type EnqueueCategories = (category: Category[]) => Promise<void>;
