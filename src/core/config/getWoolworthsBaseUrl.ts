import { errAsync, okAsync, type ResultAsync } from "neverthrow";

export const getWoolworthsBaseUrl = (): ResultAsync<string, Error> => {
  const url = process.env.WOOLWORTHS_BASE_URL;

  return url
    ? okAsync(url)
    : errAsync(new Error("Missing WOOLWORTHS_BASE_URL"));
};
