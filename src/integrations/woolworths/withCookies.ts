import { type AxiosInstance } from "axios";

export const withCookies = async (client: AxiosInstance) => {
  await client.get("/", {
    headers: {
      accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    },
  });

  return client;
};
