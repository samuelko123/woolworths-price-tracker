vi.mock("@/core/logger", () => {
  return {
    logDuration: vi.fn().mockImplementation(async (_, fn) => await fn()),
    logError: vi.fn(),
    logInfo: vi.fn(),
  };
});
