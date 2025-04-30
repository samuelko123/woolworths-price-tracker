import { fetchCategories } from "./category";

type LambdaEvent = {
  source: string;
};

export const handler = async (event: LambdaEvent) => {
  console.info({
    message: "Event received.",
    event,
  });

  await fetchCategories();
};
