import { expectErr, expectOk } from "@/tests/helpers";

import { getWoolworthsBaseUrl } from "./getWoolworthsBaseUrl";

describe("getWoolworthsBaseUrl", () => {
  const ORIGINAL_ENV = process.env;
  afterEach(() => {
    process.env = { ...ORIGINAL_ENV };
  });

  it("returns WOOLWORTHS_BASE_URL from environment variables", async () => {
    process.env.WOOLWORTHS_BASE_URL = "https://www.woolworths.com.au";

    const result = await getWoolworthsBaseUrl();

    expectOk(result);
    expect(result.value).toBe("https://www.woolworths.com.au");
  });

  it("returns error when WOOLWORTHS_BASE_URL is not defined", async () => {
    delete process.env.WOOLWORTHS_BASE_URL;

    const result = await getWoolworthsBaseUrl();

    expectErr(result);
    expect(result.error.message).toBe("Missing WOOLWORTHS_BASE_URL");
  });
});
