import { Category } from "src/domain/category";

type LambdaResponse = {
  statusCode: number;
  body: string;
};

export type LambdaHandler = () => Promise<LambdaResponse>;

export type FetchCategories = () => Promise<Category[]>;

export type PurgeCategoryQueue = () => Promise<void>;

export type EnqueueCategories = (category: Category[]) => Promise<void>;
