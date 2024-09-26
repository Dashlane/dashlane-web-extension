import { StoreService } from "Store";
const DEFAULT_DELAY_BETWEEN_CALLS = 500;
interface ThrottleOptions {
  delayBetweenCalls: number;
  getTime: () => number;
  wait: (amount: number) => Promise<void>;
}
const defaultThrottleOptions: ThrottleOptions = {
  delayBetweenCalls: DEFAULT_DELAY_BETWEEN_CALLS,
  getTime: () => new Date().getTime(),
  wait: (amount) => new Promise((resolve) => setTimeout(resolve, amount)),
};
type Method<TRequest, TResponse> = (
  storeService: StoreService,
  options: {
    login: string;
    payload: TRequest;
  }
) => Promise<TResponse>;
export const throttleEndpoint = <TRequest, TResult>(
  method: Method<TRequest, TResult>,
  options?: Partial<ThrottleOptions>
): Method<TRequest, TResult> => {
  const realOptions: ThrottleOptions = {
    ...defaultThrottleOptions,
    ...options,
  };
  let lastTime = realOptions.getTime();
  return async (service, options): Promise<TResult> => {
    const waitTime =
      lastTime + realOptions.delayBetweenCalls - realOptions.getTime();
    if (waitTime > 0) {
      await realOptions.wait(waitTime);
    }
    const result = await method(service, options);
    lastTime = realOptions.getTime();
    return result;
  };
};
