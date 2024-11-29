import { IdItem } from "../types";
function hasOwnProperty<X extends {}, Y extends PropertyKey>(
  obj: X,
  prop: Y
): obj is X & Record<Y, unknown> {
  return obj.hasOwnProperty(prop);
}
export function getTitle(data: IdItem) {
  if (hasOwnProperty(data, "idName")) {
    return data.idName as string;
  }
  if (hasOwnProperty(data, "idNumber")) {
    return data.idNumber as string;
  }
  return data.fiscalNumber;
}
