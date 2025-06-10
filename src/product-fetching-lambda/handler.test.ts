import { logger } from "../shared/logger";
import { handler } from "./handler";
import * as main from "./main";

vi.mock("./main");
vi.mock("../shared/logger");

describe("handler", () => {
  it("returns 200 when success", async () => {
    const response = await handler();

    expect(response).toEqual({
      statusCode: 200,
      body: JSON.stringify({
        message: "Success",
      }),
    });
  });

  it("returns 500 when error occurred", async () => {
    const error = new Error("This is a test error");
    vi.spyOn(main, "main").mockRejectedValueOnce(error);

    const response = await handler();

    expect(response).toEqual({
      statusCode: 500,
      body: JSON.stringify({
        message: "Something went wrong",
      }),
    });
  });

  it("logs the error when error occurred", async () => {
    const error = new Error("This is a test error");
    vi.spyOn(main, "main").mockRejectedValueOnce(error);

    await handler();

    expect(logger.error).toHaveBeenCalledWith(error);
  });
});
