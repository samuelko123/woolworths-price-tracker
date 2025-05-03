import { setupServer } from "msw/node";
import { beforeAll, beforeEach, afterAll } from "vitest";

export const testServer = setupServer();

beforeAll(() => {
  testServer.listen({ onUnhandledRequest: "warn" });
});

beforeEach(() => testServer.resetHandlers());

afterAll(() => testServer.close());

export const extractRequestHeaders = (req: Request) => {
  return [...req.headers.entries()].reduce((acc, [key, value]) => {
    acc[key] = value;
    return acc;
  }, {} as Record<string, string>);
};

export { HttpResponse, http } from "msw";
