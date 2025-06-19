import { logInfo } from "./logInfo";

describe("logInfo", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("calls console.info without metadata", () => {
    const spy = vi.spyOn(console, "info").mockImplementation(() => { });

    logInfo("Hello world");

    expect(spy).toHaveBeenCalledWith({
      message: "Hello world",
    });
  });

  it("calls console.info with metadata", () => {
    const spy = vi.spyOn(console, "info").mockImplementation(() => { });

    logInfo("Hello world", { id: 1 });

    expect(spy).toHaveBeenCalledWith({
      message: "Hello world",
      id: 1,
    });
  });
});
