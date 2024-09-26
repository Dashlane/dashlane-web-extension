import { UnknownError, UnknownErrorType } from "Libs/DashlaneApi/types";
export const getCode = <T>(
  serverCode: string,
  codes: T[]
): T | UnknownErrorType => {
  const idx = codes.indexOf(serverCode as unknown as T);
  if (idx < 0) {
    return UnknownError;
  }
  return codes[idx];
};
