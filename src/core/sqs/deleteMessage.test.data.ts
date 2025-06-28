import { type SqsMessage } from "./types";

export const mockMessage: SqsMessage = {
  queueUrl: "https://test-queue",
  body: "test",
  receiptHandle: "abc123",
};
