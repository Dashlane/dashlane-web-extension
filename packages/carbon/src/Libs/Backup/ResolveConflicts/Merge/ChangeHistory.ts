import { ascend, eqBy, prop, sort, unionWith } from "ramda";
import { ChangeHistory } from "DataManagement/ChangeHistory/";
import { ChangeSet } from "DataManagement/ChangeHistory/ChangeSet/";
export function mergeChangeHistories(
  itemA: ChangeHistory,
  itemB: ChangeHistory
): ChangeHistory {
  const hasSimilarIds = eqBy(prop("Id"));
  const byModificationDate = ascend(prop("ModificationDate"));
  const mergedChangeSets = unionWith<ChangeSet>(
    hasSimilarIds,
    itemA.ChangeSets,
    itemB.ChangeSets
  );
  return {
    ...itemA,
    ChangeSets: sort<ChangeSet>(byModificationDate, mergedChangeSets),
  };
}
