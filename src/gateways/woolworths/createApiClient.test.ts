import { errAsync, okAsync } from "neverthrow";

import { getWoolworthsBaseUrl } from "@/core/config";
import { expectErr, expectOk } from "@/tests/helpers";
import { http, HttpResponse, testServer } from "@/tests/mocks/msw";

import { createApiClient } from "./createApiClient";

vi.mock("@/core/config");

describe("createApiClient", () => {
  it("resolves with axios client if cookies initialized successfully", async () => {
    vi.mocked(getWoolworthsBaseUrl).mockReturnValue(okAsync("https://www.woolworths.com.au"));

    testServer.use(
      http.get("https://www.woolworths.com.au/", () =>
        HttpResponse.text("<html></html>", { status: 200 }),
      ),
    );

    const result = await createApiClient();

    expectOk(result);
    const client = result.value;
    expect(client.get).toEqual(expect.any(Function));
    expect(client.post).toEqual(expect.any(Function));
  });

  it("sends cookies on subsequent requests", async () => {
    vi.mocked(getWoolworthsBaseUrl).mockReturnValue(okAsync("https://www.woolworths.com.au"));

    testServer.use(
      http.get("https://www.woolworths.com.au/", () =>
        HttpResponse.text("OK", {
          headers: {
            "Set-Cookie": "sessionId=abc123; Path=/; HttpOnly",
          },
        }),
      ),
    );

    testServer.use(
      http.get("https://www.woolworths.com.au/protected", ({ request }) => {
        const cookieHeader = request.headers.get("cookie");
        if (cookieHeader?.includes("sessionId=abc123")) {
          return HttpResponse.text("Authenticated!", { status: 200 });
        }
        return HttpResponse.text("Unauthorized", { status: 401 });
      }),
    );

    const result = await createApiClient();
    expectOk(result);

    const client = result.value;
    const res = await client.get("/protected");
    expect(res.status).toBe(200);
  });

  it("fails if environment variables are missing", async () => {
    vi.mocked(getWoolworthsBaseUrl).mockReturnValue(errAsync(new Error("Missing environment variables")));

    const result = await createApiClient();

    expectErr(result);
    expect(result.error.message).toBe("Missing environment variables");
  });

  it("fails if cookie initialization fails", async () => {
    vi.mocked(getWoolworthsBaseUrl).mockReturnValue(okAsync("https://www.woolworths.com.au"));

    testServer.use(
      http.get("https://www.woolworths.com.au/", () => {
        return HttpResponse.json({ error: "Internal Server Error" }, { status: 500 });
      }),
    );

    const result = await createApiClient();

    expectErr(result);
    expect(result.error.message).toBe("Request failed with status code 500");
  });
});
