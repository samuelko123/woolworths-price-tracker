import { type AxiosInstance } from "axios";

import { getEnv } from "@/core/config";
import { createHttpClient } from "@/core/http";
import { ResultAsync } from "@/core/result";

const initCookies = (client: AxiosInstance): ResultAsync<AxiosInstance> => {
  return ResultAsync
    .fromPromise(
      client.get("/", {
        headers: {
          accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        },
      }),
    )
    .map(() => client);
};

export const createApiClient = (): ResultAsync<AxiosInstance> => {
  return ResultAsync
    .fromResult(getEnv())
    .flatMap((env) => ResultAsync.ok(createHttpClient(env.WOOLWORTHS_BASE_URL)))
    .flatMap(initCookies);
};
