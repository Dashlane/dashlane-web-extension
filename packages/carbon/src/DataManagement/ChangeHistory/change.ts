import {
  ChangeHistoryCandidate,
  RemovalChange,
  UpdateChange,
} from "DataManagement/ChangeHistory/types";
export const makeUpdateChange = (
  updatedItem: ChangeHistoryCandidate
): UpdateChange => ({
  type: "update",
  updatedItem,
});
export const makeRemovalChange = (
  removedItem: ChangeHistoryCandidate
): RemovalChange => ({
  type: "removal",
  itemId: removedItem.Id,
  itemKwType: removedItem.kwType,
});
