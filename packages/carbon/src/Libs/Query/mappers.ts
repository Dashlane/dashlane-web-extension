import { compose, toLower } from "ramda";
import { normalizeString } from "Libs/String/normalize";
const stringMapper = compose(normalizeString, toLower);
export const normalizeStringMapper = (x: any): any => {
  if (typeof x === "string") {
    return stringMapper(x);
  }
  if (Array.isArray(x)) {
    return x.map(normalizeStringMapper);
  } else {
    return x;
  }
};
