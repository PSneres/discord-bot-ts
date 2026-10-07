type Ok<T> = [T] extends [void]
  ? { success: true }
  : { success: true; data: T };

export type Result<T = void> =
  | Ok<T>
  | { success: false, error: string };