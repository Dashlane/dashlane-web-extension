import { defineCommand, UseCaseScope } from "@dashlane/framework-contracts";
import { CollectionItemPermission } from "../sharing-collections.types";
export interface AddItemsToCollectionsCommandParam {
  collectionPermissions: CollectionItemPermission[];
  itemIds: string[];
  shouldSkipSync?: boolean;
}
export class AddItemsToCollectionsCommand extends defineCommand<AddItemsToCollectionsCommandParam>(
  {
    scope: UseCaseScope.User,
  }
) {}
