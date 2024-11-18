import { AppSessionStorage } from "Store/types";
export const makeInMemorySessionStorage = (): AppSessionStorage => {
  const data: Record<string, unknown> = {};
  return {
    setItem: (key: string, value: unknown) => {
      data[key] = value;
      return Promise.resolve();
    },
    getItem: (key: string) => {
      return Promise.resolve(data[key]);
    },
    removeItem: (key: string) => {
      delete data[key];
      return Promise.resolve();
    },
  };
};
