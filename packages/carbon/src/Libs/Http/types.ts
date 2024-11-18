export interface HttpResponse<T> {
  headers: HeadersInit;
  data: T;
  status: number;
  statusText: string;
}
export type HttpRequestResponseTypes = "json" | "text" | "arraybuffer";
export interface HttpRequestConfig {
  headers?: HeadersInit;
  validateStatus?: (status: number) => boolean;
  responseType?: HttpRequestResponseTypes;
}
