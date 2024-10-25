export type TransactionPropertiesType =
  | "boolean"
  | "yes-no"
  | "json"
  | "number";
export type MapperProperty = {
  [key: string]: TransactionPropertiesType;
};
export function stringToBoolean(input: string | boolean): boolean {
  if (typeof input === "boolean") {
    return input;
  } else if (typeof input === "string") {
    return input.toLowerCase() === "true" || input.toLowerCase() === "yes";
  } else {
    return Boolean(input);
  }
}
export function booleanToString(
  input: boolean,
  transactionPropertiesType: TransactionPropertiesType
): string {
  if (transactionPropertiesType === "boolean") {
    return input ? "true" : "false";
  }
  if (transactionPropertiesType === "yes-no") {
    return input ? "YES" : "NO";
  }
  return null;
}
export function jsonToObject(input: string | object): object {
  if (typeof input === "object") {
    return input;
  } else {
    return JSON.parse(input);
  }
}
export function ObjectToJson(input: object): string {
  return JSON.stringify(input);
}
export function fixPropertiesTypes<OriginalObject extends Object>(
  booleanKeys: string[],
  numberKeys: string[],
  jsonKeys: string[],
  stringKeys: string[],
  obj: OriginalObject
): OriginalObject {
  const fixedProperties = {};
  booleanKeys
    .filter((key) => !!obj[key])
    .forEach((key) => {
      fixedProperties[key] = stringToBoolean(obj[key]);
    });
  numberKeys
    .filter((key) => !!obj[key])
    .forEach((key) => {
      fixedProperties[key] = Number(obj[key]);
    });
  jsonKeys
    .filter((key) => !!obj[key])
    .forEach((key) => {
      fixedProperties[key] = jsonToObject(obj[key]);
    });
  stringKeys
    .filter((key) => obj.hasOwnProperty(key))
    .forEach((key) => {
      const val = obj[key];
      fixedProperties[key] = val === null ? "" : String(val);
    });
  return Object.assign({}, obj, fixedProperties);
}
export const fixProperties = {
  fromStore: fixPropertiesTypesFromStoreWithMapper,
  fromTransaction: fixPersonalSettingTypesFromTransactionWithMapper,
};
function fixPersonalSettingTypesFromTransactionWithMapper<OriginalObject>(
  booleanKeys: MapperProperty,
  numberKeys: MapperProperty,
  jsonKeys: MapperProperty,
  obj: OriginalObject
): OriginalObject {
  const fixedProperties = {};
  Object.keys(booleanKeys)
    .filter((key) => !!obj[key])
    .forEach((key) => {
      fixedProperties[key] = stringToBoolean(obj[key]);
    });
  Object.keys(numberKeys)
    .filter((key) => !!obj[key])
    .forEach((key) => {
      fixedProperties[key] = Number(obj[key]);
    });
  Object.keys(jsonKeys)
    .filter((key) => !!obj[key])
    .forEach((key) => {
      fixedProperties[key] = jsonToObject(obj[key]);
    });
  return Object.assign({}, obj, fixedProperties);
}
function fixPropertiesTypesFromStoreWithMapper<OriginalObject>(
  booleanKeys: MapperProperty,
  numberKeys: MapperProperty,
  jsonKeys: MapperProperty,
  obj: OriginalObject
): OriginalObject {
  const fixedProperties = {};
  Object.keys(booleanKeys)
    .filter((key) => !!obj[key])
    .forEach((key) => {
      fixedProperties[key] = booleanToString(obj[key], booleanKeys[key]);
    });
  Object.keys(numberKeys)
    .filter((key) => !!obj[key])
    .forEach((key) => {
      fixedProperties[key] = obj[key] && obj[key].toString();
    });
  Object.keys(jsonKeys)
    .filter((key) => !!obj[key])
    .forEach((key) => {
      fixedProperties[key] = ObjectToJson(obj[key]);
    });
  return Object.assign({}, obj, fixedProperties);
}
