import * as main from "./main";
import { logger } from "../shared/logger";
import { handler } from "./handler";

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

  it("returns 204 when 'No messages received' error occurs", async () => {
    const error = new Error("No messages received from the category queue.");
    vi.spyOn(main, "main").mockRejectedValueOnce(error);

    const response = await handler();

    expect(logger.info).toHaveBeenCalledWith("No messages received from the category queue.");
    expect(response).toEqual({
      statusCode: 204,
      body: JSON.stringify({
        message: "No content",
      }),
    });
  });

  it("returns 500 when an unknown error occurred", async () => {
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

  it("logs the error when an unknown error occurred", async () => {
    const error = new Error("This is a test error");
    vi.spyOn(main, "main").mockRejectedValueOnce(error);

    await handler();

    expect(logger.error).toHaveBeenCalledWith(error);
  });
});
