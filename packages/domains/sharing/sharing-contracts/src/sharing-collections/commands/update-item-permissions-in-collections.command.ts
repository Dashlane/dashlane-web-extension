import { defineCommand, UseCaseScope } from "@dashlane/framework-contracts";
import { CollectionItemPermission } from "../sharing-collections.types";
export interface UpdatePermissionForCollectionItemCommandParam {
  groupId: string;
  collection: CollectionItemPermission;
}
export class UpdatePermissionForCollectionItemCommand extends defineCommand<UpdatePermissionForCollectionItemCommandParam>(
  {
    scope: UseCaseScope.User,
  }
) {}