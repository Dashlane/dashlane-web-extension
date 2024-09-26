import isPlainObject from "Utils/isPlainObject";
import { CryptoCenterService } from "Libs/CryptoCenter/types";
export const attemptReadCryptoPayload = (
  cryptoService: CryptoCenterService,
  content: string
): string => {
  try {
    return cryptoService.readCryptoPayload(content);
  } catch (_e) {}
  return "";
};
export function fixKwType(data: object): object {
  if (Array.isArray(data)) {
    return data.map((item: any) => fixKwType(item));
  }
  if (!isPlainObject(data)) {
    return data;
  }
  return Object.keys(data).reduce((acc, key) => {
    const property = data[key];
    if (key === "__type__") {
      acc["kwType"] = property;
    } else {
      acc[key] = fixKwType(property);
    }
    return acc;
  }, {});
}
