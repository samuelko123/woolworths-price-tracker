import { type Message } from "@aws-sdk/client-sqs";

export const mockRawMessage: Message = {
  Body: "test",
  ReceiptHandle: "abc123",
};
