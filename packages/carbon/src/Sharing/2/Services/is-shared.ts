import { curry } from "ramda";
import { Credential, Note, Secret } from "@dashlane/communication";
import { binaryContains } from "Libs/BinarySearches";
export const isShared = curry(
  (sortedSharedItemIds: string[], item: Credential | Note | Secret) =>
    binaryContains(sortedSharedItemIds, item.Id)
);
