import { Match } from "@dashlane/communication";
import { normalizeString } from "Libs/String/normalize";
export const match =
  <T>(fieldGetters: ((t: T) => string)[]): Match<T> =>
  (query: string, item: T): boolean => {
    if (typeof query !== "string" || query.length === 0) {
      return false;
    }
    return fieldGetters.some((getter) => {
      const value = getter(item) || "";
      return normalizeString(value).includes(query);
    });
  };
