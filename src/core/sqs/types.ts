export type AcknowledgeFn = () => Promise<void>;

export type SqsMessage = {
  body: string;
  acknowledge: AcknowledgeFn;
};
