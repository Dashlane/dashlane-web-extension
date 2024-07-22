import { format } from "date-fns";
export function isKeyInItem<T extends object>(
  key: string | number | symbol,
  item: T
): key is keyof T {
  return key in item;
}
export function mapKeysToLowercase<T>(object: any) {
  const result: {
    [key: string]: any;
  } = {};
  for (const key in object) {
    result[key.charAt(0).toLowerCase() + key.slice(1)] = object[key];
  }
  return result as T;
}
export const formatDate = (dateString: string) => {
  if (!dateString || dateString.split("-").length !== 3) {
    return "";
  }
  const splitDate = dateString.split("-");
  const year = Number(splitDate[0]);
  const month = Number(splitDate[1]) - 1;
  const day = Number(splitDate[2]);
  return format(new Date(year, month, day), "yyyy-MM-dd");
};
