import { errAsync, okAsync } from "neverthrow";

export const getWoolworthsBaseUrl = () => {
  const url = process.env.WOOLWORTHS_BASE_URL;

  return url
    ? okAsync(url)
    : errAsync(new Error("Missing WOOLWORTHS_BASE_URL"));
};
