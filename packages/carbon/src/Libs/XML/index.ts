import { compose, defaultTo, isNil, map, omit, reject, unary } from "ramda";
import {
  BaseDataModelObject,
  Credential,
  DataModelObject,
  PersonalSettings,
} from "@dashlane/communication";
import {
  isKWXMLElement,
  KWXmlData,
  KWXMLElement,
  parseXml,
  toXml,
} from "@dashlane/kw-xml";
import { CarbonError } from "Libs/Error";
import { KWXMLError, KWXMLErrorCode } from "Libs/XML/Errors";
import isPlainObject from "Utils/isPlainObject";
import { ChangeHistory } from "DataManagement/ChangeHistory";
import { fixPersonalSettingTypes } from "Session/Store/personalSettings/fixTypes";
import {
  fixBreachTypesFromStore,
  fixCredentialTypesFromStore,
  fixNoteTypesFromStore,
} from "Session/Store/personalData/normalizeData/fixTypes";
export async function parseDashlaneXml(xmlString: string): Promise<KWXmlData> {
  try {
    return await new Promise((resolve, reject) => {
      parseXml(
        (err: Error, result: KWXmlData) => {
          if (err) {
            return reject(err);
          } else {
            return resolve(result);
          }
        },
        xmlString,
        { fixType: false }
      );
    });
  } catch (error) {
    throw new CarbonError(
      KWXMLError,
      KWXMLErrorCode.PARSING_FAILED
    ).addAdditionalInfo({
      libError: `${error}`,
    });
  }
}
export type TransformableDataToXml = BaseDataModelObject | ChangeHistory;
export type GetDashlaneXmlParam =
  | TransformableDataToXml
  | TransformableDataToXml[];
export function getDashlaneXml(data: GetDashlaneXmlParam): string {
  const cleanedData = Array.isArray(data)
    ? map(getCleanedDataForXml, data)
    : getCleanedDataForXml(data);
  return toXml(cleanedData, { pretty: false, allowEmpty: true });
}
interface OmittedPropertiesPerType {
  KWAuthentifiant: (keyof Credential)[];
  KWSettingsManagerApp: (keyof PersonalSettings)[];
}
function getCleanedDataForXml(
  data: BaseDataModelObject | ChangeHistory
): KWXMLElement {
  const omittedPropertiesPerType: OmittedPropertiesPerType = {
    KWAuthentifiant: ["domainIcon"],
    KWSettingsManagerApp: ["kwType", "LastBackupTime", "Id"],
  };
  const fixPropertiesPerType = {
    KWAuthentifiant: fixCredentialTypesFromStore,
    KWSecureNote: fixNoteTypesFromStore,
    KWSecurityBreach: fixBreachTypesFromStore,
    KWSettingsManagerApp: fixPersonalSettingTypes.fromStore,
  };
  const keyMap: {
    [k in keyof DataModelObject]?: string;
  } = {
    kwType: "__type__",
  };
  const omitKeys = compose<KWXMLElement, KWXMLElement, KWXMLElement>(
    reject(isNil),
    omit(defaultTo([], omittedPropertiesPerType[data.kwType]))
  );
  let cleanObject = omitKeys(renameKeys<KWXMLElement>(keyMap, data));
  if (fixPropertiesPerType[data.kwType]) {
    cleanObject = fixPropertiesPerType[data.kwType](cleanObject);
  }
  return cleanObject;
}
function renameKeys<T>(
  keyMap: {
    [k: string]: string;
  },
  obj: any
): T {
  function renameKey<U>(obj: any): U {
    if (!isPlainObject(obj)) {
      return obj;
    }
    return Object.keys(obj).reduce((acc, key) => {
      const destKey = keyMap[key] || key;
      const value = obj[key];
      if (Array.isArray(value)) {
        acc[destKey] = value.map(unary(renameKey));
      } else if (isPlainObject(value)) {
        acc[destKey] = renameKey(value);
      } else {
        acc[destKey] = value;
      }
      return acc;
    }, {} as U);
  }
  return renameKey<T>(obj);
}
export function removeNamespace(type: string) {
  if (type.includes(":")) {
    const colonLocation = type.indexOf(":");
    return type.substring(colonLocation + 1, type.length);
  } else {
    return type;
  }
}
export function findAllKWXMLElementsOfType(
  element: KWXMLElement,
  type: string,
  foundElements: KWXMLElement[] = []
): KWXMLElement[] {
  if (removeNamespace(element.__type__) === type) {
    foundElements.push(element);
  }
  if (element.__children__ && element.__children__.length > 0) {
    for (let i = 0; i < element.__children__.length; i++) {
      const childElement = element.__children__[i];
      if (isKWXMLElement(childElement)) {
        findAllKWXMLElementsOfType(childElement, type, foundElements);
      }
    }
  }
  return foundElements;
}
