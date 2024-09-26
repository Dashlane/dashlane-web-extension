export type MergeResult<T> =
  | {
      success: false;
    }
  | {
      success: true;
      result: T;
    };
