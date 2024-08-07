export const PARAM_SEPARATOR = " | ";
export const INFO_SEPARATOR = " - ";
export const TAGS_SEPARATOR = "/";
export function stringifyData(param: unknown, space?: number): string {
  if (typeof param === "object") {
    return JSON.stringify(param, null, space);
  }
  return String(param);
}
