export const toError = (e: unknown): Error => {
  return e instanceof Error ? e : new Error(String(e));
};
