export function getUrlGivenQuery(
  baseUrl: string,
  query: Record<string, string | number | boolean>
): string {
  const stringifiedQuery = Object.keys(query)
    .map(
      (key) => `${encodeURIComponent(key)}=${encodeURIComponent(query[key])}`
    )
    .join("&");
  const urlParts = [baseUrl, "?", stringifiedQuery];
  return urlParts.join("");
}
