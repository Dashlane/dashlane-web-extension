import axios from "axios";
import * as queryString from "query-string";
import {
  ApiAuth,
  ApiResponse,
  ApiResponseError,
  ApiTeamPlansGetTeamLastUpdateTs,
  FetchOptions,
  FetchParams,
  FetchRequest,
  IsCacheUpToDateResponse,
  PostResponse,
} from "./types";
interface CacheEntry {
  isPending: boolean;
  lastUpdateTimestamp: number;
  promise: Promise<ApiResponse> | null;
  response?: unknown;
}
let cache: {
  [key: string]: CacheEntry;
} = {};
export function clearCache(): void {
  cache = {};
}
export default class Api {
  private readonly _auth: ApiAuth;
  private _fetchRequests: FetchRequest[] = [];
  constructor(
    { login, uki, teamId }: ApiAuth = { login: null, uki: null, teamId: null }
  ) {
    this._auth = { login, uki, teamId };
  }
  private _debounce(
    requestKey: string,
    request: Function,
    noCache: boolean
  ): Promise<ApiResponse> {
    if (noCache) {
      return request();
    }
    if (!cache[requestKey]) {
      cache[requestKey] = {
        isPending: false,
        lastUpdateTimestamp: 0,
        promise: null,
      };
    }
    const { promise, isPending } = cache[requestKey];
    if (promise && isPending) {
      return promise;
    }
    cache[requestKey].isPending = true;
    const upToDatePromise = this._isCacheUpToDate(requestKey).then(
      (cacheState: IsCacheUpToDateResponse) => {
        if (cacheState.isUpToDate && cache[requestKey]) {
          cache[requestKey].isPending = false;
          return cache[requestKey].response;
        }
        return request().then((response: ApiResponse) => {
          if (!cache[requestKey]) {
            throw new Error("Cache has been cleared");
          }
          cache[requestKey] = {
            promise: null,
            isPending: false,
            response: response,
            lastUpdateTimestamp: cacheState.remoteLastUpdateTimestamp,
          };
          return response;
        });
      }
    );
    cache[requestKey].promise = upToDatePromise;
    return upToDatePromise;
  }
  private async _isCacheUpToDate(
    cacheKey: string
  ): Promise<IsCacheUpToDateResponse> {
    const response = await this._post<ApiTeamPlansGetTeamLastUpdateTs>(
      { apiVersion: 1, apiObject: "teamPlans" },
      "getTeamLastUpdateTs"
    );
    if (!("timestamp" in response)) {
      return {
        isUpToDate: false,
        remoteLastUpdateTimestamp: 0,
      };
    }
    return {
      isUpToDate: Boolean(
        response.timestamp &&
          cache[cacheKey].lastUpdateTimestamp === response.timestamp
      ),
      remoteLastUpdateTimestamp: response.timestamp,
    };
  }
  private async _post<T = {}>(
    { apiVersion, apiObject }: FetchParams,
    apiMethod: string,
    data: {} = {}
  ): Promise<ApiResponse | T> {
    data = Object.assign(data || {}, this._auth);
    const keys = Object.keys(data);
    const isMultipart = keys.some((key: string) => data[key] instanceof File);
    data = isMultipart
      ? keys.reduce((formData: FormData, key: string) => {
          formData.append(key, data[key]);
          return formData;
        }, new FormData())
      : queryString.stringify(data);
    try {
      const response: PostResponse = await axios.post(
        `${WS_URL}/${apiVersion}/${apiObject}/${apiMethod}`,
        data
      );
      const content = response.data.content;
      if (!content) {
        return {};
      }
      if (content.error) {
        const apiResponse: ApiResponseError = {
          code: content.error,
          isError: true,
        };
        if (content.stripeError) {
          apiResponse.subCode = content.stripeError;
        }
        return apiResponse;
      }
      return content;
    } catch (error) {
      const message =
        error instanceof Error ? error.message : `Unexpected error`;
      return {
        code: "Generic",
        isError: true,
        message,
      };
    }
  }
  public fetch(
    { apiVersion, apiObject }: FetchParams,
    apiMethod: string,
    options: FetchOptions = {}
  ): Promise<ApiResponse> {
    const _options = {
      data: options.data || {},
      noCache: !!options.noCache,
    };
    const cacheKey = `${apiObject}${apiMethod}${apiVersion}`;
    return new Promise((resolve, reject) =>
      this._debounce(
        cacheKey,
        () => this._post({ apiVersion, apiObject }, apiMethod, _options.data),
        _options.noCache
      ).then((response: ApiResponse) =>
        (response as ApiResponseError).isError
          ? reject(response)
          : resolve(response)
      )
    );
  }
  public fetchAll(): Promise<ApiResponse[]> {
    const _fetchRequests = this._fetchRequests;
    this._fetchRequests = [];
    return Promise.all(
      _fetchRequests.map((fetchRequest) =>
        this.fetch(
          fetchRequest.params,
          fetchRequest.apiMethod,
          fetchRequest.data
        )
      )
    );
  }
  public push(
    { apiVersion, apiObject }: FetchParams,
    apiMethod: string,
    data?: {}
  ): void {
    this._fetchRequests.push({
      params: { apiVersion, apiObject },
      apiMethod: apiMethod,
      data: data,
    });
  }
}
