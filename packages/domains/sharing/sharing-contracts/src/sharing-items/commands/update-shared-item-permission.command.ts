import { defineCommand, UseCaseScope } from "@dashlane/framework-contracts";
import { GroupRecipient, Permission, UserRecipient } from "../../common-types";
export interface UpdateSharedItemPermissionCommandParam {
  vaultItemId: string;
  recipient: UserRecipient | GroupRecipient;
  permission: Permission;
}
export class UpdateSharedItemPermissionCommand extends defineCommand<UpdateSharedItemPermissionCommandParam>(
  {
    scope: UseCaseScope.User,
  }
) {}
