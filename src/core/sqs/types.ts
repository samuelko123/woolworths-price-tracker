export type SqsMessage = {
  body: string;
  acknowledge: () => Promise<void>;
};
