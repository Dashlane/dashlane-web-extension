export const DEFAULT_ASYNC_INIT_TIMEOUT_MS = 10000;
export function timeout(ms: number, timeoutErrorFn: () => Error) {
  return new Promise<never>((_, reject) =>
    setTimeout(() => reject(timeoutErrorFn), ms)
  );
}
export function promiseWithTimeout<T>(
  promise: Promise<T>,
  ms: number,
  timeoutErrorFn: () => Error
) {
  return Promise.race([promise, timeout(ms, timeoutErrorFn)]);
}
