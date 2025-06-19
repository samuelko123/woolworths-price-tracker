export type LogError = (error: unknown) => void;
export type LogInfo = (message: string, metadata?: Record<string, unknown>) => void;
