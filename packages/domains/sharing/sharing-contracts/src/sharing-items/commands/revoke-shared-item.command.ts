import { defineCommand, UseCaseScope } from "@dashlane/framework-contracts";
import { GroupRecipient, UserRecipient } from "../../common-types";
export type Recipient = UserRecipient | GroupRecipient;
export interface RevokeSharedItemCommandParam {
  vaultItemId: string;
  recipient: Recipient;
}
export class RevokeSharedItemCommand extends defineCommand<RevokeSharedItemCommandParam>(
  {
    scope: UseCaseScope.User,
  }
) {}
