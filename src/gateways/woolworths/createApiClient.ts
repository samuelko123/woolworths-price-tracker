import { type AxiosInstance } from "axios";
import { okAsync, ResultAsync } from "neverthrow";

import { getWoolworthsBaseUrl } from "@/core/config";
import { toError } from "@/core/error";
import { createHttpClient } from "@/core/http";

const initCookies = (client: AxiosInstance): ResultAsync<AxiosInstance, Error> => {
  return ResultAsync
    .fromPromise(
      client.get("/", {
        headers: {
          accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        },
      }),
      toError,
    )
    .map(() => client);
};

export const createApiClient = (): ResultAsync<AxiosInstance, Error> => {
  return getWoolworthsBaseUrl()
    .andThen((baseUrl) => okAsync(createHttpClient(baseUrl)))
    .andThen(initCookies);
};
