import { StoreService } from "Store";
import { isApiError } from "Libs/DashlaneApi";
const DEFAULT_CACHE_EXPIRY = 3600;
interface Cache<TResult> {
  clear: () => void;
  get: (requestKey: string, dateExpectation: number) => TResult | undefined;
  put: (requestKey: string, response: TResult, date: number) => void;
}
type CacheEntry<TResult> = {
  response: TResult;
  date: number;
};
function makeCache<TResult>(): Cache<TResult> {
  const entries: Record<string, CacheEntry<TResult>> = {};
  return {
    clear: () => {
      const keys = Object.keys(entries);
      for (const k of keys) {
        delete entries[k];
      }
    },
    get: (requestKey, date) => {
      const entry = entries[requestKey];
      if (!entry || entry.date < date) {
        return undefined;
      }
      return entry.response;
    },
    put: (requestKey, response, date) => {
      entries[requestKey] = {
        date,
        response,
      };
    },
  };
}
interface CacheOptions {
  cacheExpiration: number;
  getTime: () => number;
}
const defaultCacheOptions: CacheOptions = {
  cacheExpiration: DEFAULT_CACHE_EXPIRY,
  getTime: () => new Date().getTime(),
};
type Method<TRequest, TResponse> = (
  storeService: StoreService,
  options: {
    login: string;
    payload: TRequest;
  }
) => Promise<TResponse>;
export const cacheEndpoint = <TRequest, TResult>(
  method: Method<TRequest, TResult>,
  options?: Partial<CacheOptions>
): Method<TRequest, TResult> => {
  const realOptions: CacheOptions = { ...defaultCacheOptions, ...options };
  const cache = makeCache<TResult>();
  return async (service, options): Promise<TResult> => {
    const key = JSON.stringify(options);
    const now = realOptions.getTime();
    const inCache = cache.get(key, now - realOptions.cacheExpiration);
    if (inCache) {
      return inCache;
    }
    const response = await method(service, options);
    if (!isApiError(response)) {
      cache.put(key, response, now);
    }
    return response;
  };
};
