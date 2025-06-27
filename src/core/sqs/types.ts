export type AcknowledgeFn = () => Promise<void>;

export type SqsMessage = {
  queueUrl: string;
  body: string;
  receiptHandle: string;
};
