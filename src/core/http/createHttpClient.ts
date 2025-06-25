import axios from "axios";
import { wrapper } from "axios-cookiejar-support";
import { CookieJar } from "tough-cookie";

export const createHttpClient = (baseURL: string) => {
  const jar = new CookieJar();
  const client = wrapper(
    axios.create({
      baseURL,
      timeout: 5000,
      jar,
      withCredentials: true,
      headers: {
        accept: "application/json",
        "accept-encoding": "gzip, compress, deflate, br",
        "accept-language": "en-US,en;q=0.5",
        "cache-control": "no-cache",
        connection: "keep-alive",
        "content-type": "application/json",
        "user-agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:137.0) Gecko/20100101 Firefox/137.0",
      },
    }),
  );

  return client;
};
