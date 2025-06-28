import { ResultAsync } from "../result";

export const getWoolworthsBaseUrl = () => {
  const url = process.env.WOOLWORTHS_BASE_URL;

  return url
    ? ResultAsync.ok(url)
    : ResultAsync.err(new Error("Missing WOOLWORTHS_BASE_URL"));
};
