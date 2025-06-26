import { setupServer } from "msw/node";

export const testServer = setupServer();

beforeAll(() => testServer.listen({ onUnhandledRequest: "warn" }));
beforeEach(() => testServer.resetHandlers());
afterAll(() => testServer.close());

export { http, HttpResponse } from "msw";
