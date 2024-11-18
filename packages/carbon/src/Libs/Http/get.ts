import { HttpRequestConfig, HttpResponse } from "Libs/Http/types";
import { httpGetUsingFetch } from "Libs/Http/getFetch";
export function get<T>(
  endpoint: string,
  httpConfig: HttpRequestConfig = {}
): Promise<HttpResponse<T>> {
  return httpGetUsingFetch(endpoint, httpConfig);
}
