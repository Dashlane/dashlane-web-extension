import { HttpRequestConfig, HttpResponse } from "Libs/Http/types";
import { httpPostUsingFetch } from "Libs/Http/postFetch";
export function post<T>(
  endpoint: string,
  data: Record<string, unknown> | string,
  httpConfig: HttpRequestConfig = {}
): Promise<HttpResponse<T>> {
  return httpPostUsingFetch(endpoint, data, httpConfig);
}
