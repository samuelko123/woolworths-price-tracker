export type SqsMessage = {
  queueUrl: string;
  body: string;
  receiptHandle: string;
};
