export type TypeOfArray<T> = T extends Array<infer Q> ? Q : never;
