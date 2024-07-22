import { defineCommand, UseCaseScope } from "@dashlane/framework-contracts";
import {
  SharedCollectionUserGroupRecipient,
  SharedCollectionUserRecipient,
} from "../sharing-collections.types";
export interface InviteCollectionMembersCommandParam {
  collectionId: string;
  userRecipients?: SharedCollectionUserRecipient[];
  userGroupRecipients?: SharedCollectionUserGroupRecipient[];
}
export class InviteCollectionMembersCommand extends defineCommand<InviteCollectionMembersCommandParam>(
  {
    scope: UseCaseScope.User,
  }
) {}
