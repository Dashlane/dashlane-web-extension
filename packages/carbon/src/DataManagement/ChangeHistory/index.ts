import { equals, last } from "ramda";
import {
  DataModelObject,
  isCredential,
  isNote,
  isSecret,
  PlatformInfo,
} from "@dashlane/communication";
import { generateItemUuid } from "Utils/generateItemUuid";
import { getChangeSet } from "DataManagement/ChangeHistory/ChangeSet";
import {
  Change,
  ChangeHistory,
  ChangeHistoryCandidate,
} from "DataManagement/ChangeHistory/types";
import {
  ChangeSet,
  ChangeSetCurrentData,
} from "DataManagement/ChangeHistory/ChangeSet/types";
import dataTypes from "Session/Store/personalData/dataTypes";
import { PersonalData } from "Session/Store/personalData/types";
import { getTransactionTypeFromDataModelType } from "Libs/Backup/Transactions/types";
import { findDataModelObject } from "DataManagement/PersonalData/utils";
export { ChangeHistory };
export interface UpdatedItemChangeHistoryParams {
  deviceName: string;
  change: Change;
  personalData: PersonalData;
  userLogin: string;
  platformInfo: PlatformInfo;
}
export function getEmptyChangeHistory(change: Change): ChangeHistory {
  const [itemId, kwType, title] =
    change.type === "removal"
      ? [change.itemId, change.itemKwType, ""]
      : [
          change.updatedItem.Id,
          change.updatedItem.kwType,
          change.updatedItem.Title || "",
        ];
  return {
    kwType: "KWDataChangeHistory",
    ChangeSets: [],
    Id: generateItemUuid(),
    ObjectId: itemId,
    ObjectTitle: title,
    ObjectType: getTransactionTypeFromDataModelType(kwType),
    LastBackupTime: 0,
  };
}
const areRecentChangeSetsSimilar = (
  lastSavedChangeSet: ChangeSet,
  newChangeSet: ChangeSet
): boolean =>
  equals<ChangeSetCurrentData>(
    newChangeSet.CurrentData,
    lastSavedChangeSet.CurrentData
  );
export function isChangeHistoryCandidate(
  item: DataModelObject
): item is ChangeHistoryCandidate {
  return isCredential(item) || isNote(item) || isSecret(item);
}
export function getUpdatedItemChangeHistory(
  params: UpdatedItemChangeHistoryParams
): ChangeHistory | null {
  const { deviceName, personalData, change, userLogin, platformInfo } = params;
  const [itemId, kwType, title] =
    change.type === "removal"
      ? [change.itemId, change.itemKwType, ""]
      : [
          change.updatedItem.Id,
          change.updatedItem.kwType,
          change.updatedItem.Title,
        ];
  const dataTypeKeyInStore = dataTypes[kwType];
  const storedItem = findDataModelObject<DataModelObject>(
    itemId,
    personalData[dataTypeKeyInStore]
  );
  const newChangeSet = getChangeSet({
    deviceName,
    change,
    oldItem: storedItem,
    userLogin,
    platformInfo,
  });
  if (!newChangeSet) {
    return null;
  }
  const itemChangeHistory = personalData.changeHistories.find(
    (changeHistory) =>
      changeHistory?.ObjectId?.toUpperCase() === (itemId || "").toUpperCase()
  );
  const changeHistory = !itemChangeHistory
    ? getEmptyChangeHistory(change)
    : itemChangeHistory;
  const lastSavedChangeSet = last(changeHistory.ChangeSets);
  if (
    lastSavedChangeSet &&
    areRecentChangeSetsSimilar(lastSavedChangeSet, newChangeSet)
  ) {
    return null;
  }
  return {
    ...changeHistory,
    ObjectTitle: title,
    ChangeSets: changeHistory.ChangeSets.concat(newChangeSet),
  };
}
