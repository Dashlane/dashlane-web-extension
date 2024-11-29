export const removeDuplicateSlashesFromUrl = (url: string) => {
  return url.replace(/([^:]\/)\/+/g, "$1");
};
export const appendToUrl = (url: string, path: string) => {
  return removeDuplicateSlashesFromUrl(url + "/" + path);
};
export const removeFromUrl = (url: string, path: string) => {
  const newUrl = url.substring(0, url.indexOf(path));
  return removeDuplicateSlashesFromUrl(newUrl);
};
export function getUrlGivenDefinedQuery(
  baseUrl: string,
  query: Record<string, any>
): string {
  const stringifiedQuery = Object.keys(query)
    .map((key) =>
      key
        ? `${encodeURIComponent(key)}=${encodeURIComponent(query[key])}`
        : undefined
    )
    .join("&");
  const urlParts = [baseUrl, "?", stringifiedQuery];
  return urlParts.join("");
}
export function isUserCurrentlyOnline(): boolean {
  return navigator.onLine;
}
