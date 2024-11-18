interface CloudflareHeaders {
  "CF-Access-Client-Id": string;
  "CF-Access-Client-Secret": string;
}
let headers: CloudflareHeaders | Record<string, never> = {};
export function resetCloudflareHeaders() {
  headers = {};
}
