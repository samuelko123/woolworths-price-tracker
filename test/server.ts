import { setupServer } from "msw/node";

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

export { http, HttpResponse } from "msw";
