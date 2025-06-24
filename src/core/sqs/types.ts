import { type Result } from "@/core/result";

export type AcknowledgeFn = () => Promise<Result<void>>;

export type SqsMessage = {
  body: string;
  acknowledge: AcknowledgeFn;
};
