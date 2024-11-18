import { safeCast } from "@dashlane/framework-types";
export const createIndex = <T>(list: T[], getId: (t: T) => string) => {
  return list.reduce((acc, entry) => {
    acc[getId(entry)] = entry;
    return acc;
  }, safeCast<Record<string, T>>({}));
};
