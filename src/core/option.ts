export type Option<T> = Some<T> | None;

interface Some<T> {
  readonly kind: "some";
  readonly value: T;
}

interface None {
  readonly kind: "none";
}

export const Option = {
  of: <T>(value: T): Option<T> => ({ kind: "some", value }),
  empty: (): Option<never> => ({ kind: "none" }),
};

export const isPresent = <T>(opt: Option<T>): opt is Some<T> => opt.kind === "some";
export const isEmpty = <T>(opt: Option<T>): opt is None => opt.kind === "none";
