type PromiseState = "pending" | "fulfilled" | "rejected";
export function checkPromiseState<T>(
  promise: Promise<T>,
  timeout: number
): Promise<PromiseState> {
  return Promise.race<PromiseState>([
    promise
      .then(() => {
        return "fulfilled" as const;
      })
      .catch(() => {
        return "rejected" as const;
      }),
    new Promise((resolve) => {
      setTimeout(() => resolve("pending" as const), timeout);
    }),
  ]);
}
