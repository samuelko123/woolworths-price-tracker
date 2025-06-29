import { type Result, type ResultAsync } from "neverthrow";

export type LogError = (error: unknown) => void;
export type LogInfo = (message: string, metadata?: Record<string, unknown>) => void;
export type LogDuration = <T>(label: string, fn: () => ResultAsync<T, Error>) => Promise<Result<T, Error>>;
