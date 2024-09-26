import { clone } from "ramda";
import { BaseDataModelObject } from "@dashlane/communication";
import type { ClearTransaction } from "Libs/Backup/Transactions/types";
import { PersonalData } from "Session/Store/personalData/types";
import { mergingRules } from "Libs/Backup/ResolveConflicts/Duplicate/rules/objectsMergingRules";
import { filterDataModelObjects } from "DataManagement/PersonalData/utils";
import { generateItemUuid } from "Utils/generateItemUuid";
import { canonizeText } from "Utils/canonizeText";
import {
  findTransaction,
  isRemovalTransaction,
} from "Libs/Backup/Transactions";
import { fixPersonalDataItemFromExternalSource } from "Session/Store/personalData/normalizeData";
import { ParsedURL } from "@dashlane/url-parser";
const isDuplicationNeeded = (
  localObject: BaseDataModelObject,
  remoteTransaction: ClearTransaction
): boolean => {
  const rules = mergingRules[remoteTransaction.type];
  if (!rules || rules.length === 0) {
    return false;
  }
  if (!remoteTransaction.content) {
    return false;
  }
  const sanitizedRemoteContent = fixPersonalDataItemFromExternalSource(
    remoteTransaction.content,
    remoteTransaction.identifier
  );
  for (const { property, canonize } of rules) {
    let localValue = localObject[property];
    let remoteValue = sanitizedRemoteContent[property];
    if (
      property === "Domain" &&
      remoteTransaction.type === "AUTHENTIFIANT" &&
      localValue &&
      remoteValue
    ) {
      localValue = new ParsedURL(localObject["Url"]).getRootDomain();
      remoteValue = new ParsedURL(
        sanitizedRemoteContent["Url"]
      ).getRootDomain();
    }
    const localProperty = canonize ? canonizeText(localValue) : localValue;
    const remoteProperty = canonize ? canonizeText(remoteValue) : remoteValue;
    if (localProperty !== remoteProperty) {
      return true;
    }
  }
  return false;
};
export interface LocalDuplicate {
  duplicate: BaseDataModelObject;
  duplicatedFromId: string;
}
export function generateLocalDuplicates(
  conflictingIds: string[],
  localPersonalData: PersonalData,
  conflictingRemotes: ClearTransaction[]
): LocalDuplicate[] {
  const localObjects = filterDataModelObjects(
    localPersonalData,
    conflictingIds,
    ["changeHistories"]
  );
  const duplicateIfNeeded = (
    localTransaction: BaseDataModelObject
  ): LocalDuplicate => {
    const remoteTransaction = findTransaction(
      localTransaction.Id,
      conflictingRemotes
    );
    if (!remoteTransaction || isRemovalTransaction(remoteTransaction)) {
      return null;
    }
    if (!isDuplicationNeeded(localTransaction, remoteTransaction)) {
      return null;
    }
    const duplicate = {
      ...clone(localTransaction),
      Id: generateItemUuid(),
    };
    return {
      duplicate,
      duplicatedFromId: localTransaction.Id,
    };
  };
  return localObjects.reduce<LocalDuplicate[]>((duplicatesList, val) => {
    const duplicate = duplicateIfNeeded(val);
    if (!duplicate) {
      return duplicatesList;
    }
    duplicatesList.push(duplicate);
    return duplicatesList;
  }, []);
}
