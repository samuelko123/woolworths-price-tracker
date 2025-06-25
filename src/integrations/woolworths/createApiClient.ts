import { type AxiosInstance } from "axios";

import { getEnv } from "@/core/config";
import { createHttpClient } from "@/core/http";

export const initCookies = async (client: AxiosInstance) => {
  await client.get("/", {
    headers: {
      accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    },
  });
};

export const createApiClient = async () => {
  const envResult = getEnv();
  if (!envResult.success) throw new Error("Failed to load environment variables");
  const { WOOLWORTHS_BASE_URL } = envResult.value;

  const client = createHttpClient(WOOLWORTHS_BASE_URL);
  await initCookies(client);
  return client;
};
