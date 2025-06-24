import { mockEnvData } from "./env.data";

const ORIGINAL_ENV = process.env;

beforeEach(() => {
  process.env = {
    ...ORIGINAL_ENV,
    ...mockEnvData,
  };
});

afterEach(() => {
  process.env = ORIGINAL_ENV;
});
