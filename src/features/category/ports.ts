import { type Category } from "@/domain";

type LambdaResponse = {
  statusCode: number;
  body: string;
};

export type LambdaHandler = () => Promise<LambdaResponse>;

export type FetchCategories = () => Promise<Category[]>;

export type PurgeCategoryQueue = () => Promise<void>;

export type EnqueueCategories = (category: Category[]) => Promise<void>;
