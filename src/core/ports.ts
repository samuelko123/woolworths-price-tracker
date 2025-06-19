type LambdaResponse = {
  statusCode: number;
  body: string;
};

export type LambdaHandler = () => Promise<LambdaResponse>;
