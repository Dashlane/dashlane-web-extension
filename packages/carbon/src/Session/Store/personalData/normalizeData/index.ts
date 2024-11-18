import { omit } from "ramda";
import {
  BaseDataModelObject,
  Credential,
  GeneratedPassword,
  isCredential,
  isGeneratedPassword,
  isNote,
  isPasskey,
  Note,
  Passkey,
} from "@dashlane/communication";
import {
  LegacyPersonalData,
  PersonalData,
  PersonalDataCollections,
} from "Session/Store/personalData/types";
import {
  fixBreachTypesFromTransaction,
  fixCommonPropertiesTypes,
  fixCredentialTypesFromTransaction,
  fixGeneratedPasswordsTypes,
  fixNoteTypesFromTransaction,
  fixPasskeyTypesFromTransaction,
} from "Session/Store/personalData/normalizeData/fixTypes";
import addCommonPropertiesDefaultValues from "Session/Store/personalData/normalizeData/addCommonPropertiesDefaultValues";
import { VersionedBreach } from "DataManagement/Breaches/types";
import { isBreach } from "DataManagement/Breaches/guards";
interface DataTypeToFix<T extends BaseDataModelObject> {
  key: keyof PersonalDataCollections;
  isData: (o: BaseDataModelObject) => o is T;
  fixData: (o: T) => T;
  addDefaultValues: (o: T) => T;
}
const dataTypesToFix = [
  {
    key: "credentials",
    isData: isCredential,
    fixData: (item) => fixCredentialTypesFromTransaction(item),
    addDefaultValues: (item) => addCommonPropertiesDefaultValues(item),
  } as DataTypeToFix<Credential>,
  {
    key: "notes",
    isData: isNote,
    fixData: (item) => fixNoteTypesFromTransaction(item),
    addDefaultValues: (item) => addCommonPropertiesDefaultValues(item),
  } as DataTypeToFix<Note>,
  {
    key: "generatedPasswords",
    isData: isGeneratedPassword,
    fixData: (item) => fixGeneratedPasswordsTypes(item),
    addDefaultValues: (item) => item,
  } as DataTypeToFix<GeneratedPassword>,
  {
    key: "securityBreaches",
    isData: isBreach,
    fixData: (item) => fixBreachTypesFromTransaction(item),
    addDefaultValues: (item) => item,
  } as DataTypeToFix<VersionedBreach>,
  {
    key: "passkeys",
    isData: isPasskey,
    fixData: (item) => fixPasskeyTypesFromTransaction(item),
    addDefaultValues: (item) => item,
  } as DataTypeToFix<Passkey>,
];
function fixPersonalDataItemId(
  item: BaseDataModelObject,
  transactionId?: string
): BaseDataModelObject {
  if (transactionId) {
    return {
      ...item,
      Id: transactionId,
    };
  } else {
    return item;
  }
}
export function fixPersonalDataItemFromExternalSource(
  item: BaseDataModelObject,
  transactionId?: string
): BaseDataModelObject {
  const itemWithFixedId = fixPersonalDataItemId(item, transactionId);
  const dataTypeToFix = dataTypesToFix.find((dataTypeToFix) =>
    dataTypeToFix.isData(itemWithFixedId)
  );
  if (dataTypeToFix) {
    return normalizeItem(dataTypeToFix, itemWithFixedId);
  }
  return fixCommonPropertiesTypes(itemWithFixedId);
}
const DROPPED_LEGACY_PERSONAL_DATA_KEYS: (keyof LegacyPersonalData)[] = [
  "breaches",
  "versionedBreaches",
];
export function fixPersistedPersonalData(
  data: PersonalData & Partial<LegacyPersonalData>
): PersonalData {
  const fixedData: Partial<PersonalData> = {};
  dataTypesToFix.forEach(
    <T extends BaseDataModelObject>(dataTypeToFix: DataTypeToFix<T>) => {
      const itemsToFix: T[] = data[dataTypeToFix.key] as unknown as T[];
      if (!itemsToFix) {
        return;
      }
      const fixedDataArray = itemsToFix.map((item: T) =>
        normalizeItem(dataTypeToFix, item)
      );
      fixedData[dataTypeToFix.key] = fixedDataArray as unknown as any;
    }
  );
  const fixedCredentials = (fixedData.credentials ?? []).filter(
    (credential) => !!credential.Id
  );
  return {
    ...omit(DROPPED_LEGACY_PERSONAL_DATA_KEYS, data),
    ...fixedData,
    credentials: fixedCredentials,
  };
}
function normalizeItem(
  dataTypeToFix: DataTypeToFix<BaseDataModelObject>,
  item: BaseDataModelObject
) {
  return dataTypeToFix.addDefaultValues(dataTypeToFix.fixData(item));
}
