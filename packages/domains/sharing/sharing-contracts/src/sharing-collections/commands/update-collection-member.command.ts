import { defineCommand, UseCaseScope } from "@dashlane/framework-contracts";
import {
  SharedCollectionUserGroupRecipient,
  SharedCollectionUserRecipient,
} from "../sharing-collections.types";
export interface UpdateCollectionMembersCommandParam {
  collectionId: string;
  userRecipients?: SharedCollectionUserRecipient[];
  userGroupRecipients?: SharedCollectionUserGroupRecipient[];
}
export class UpdateCollectionMembersCommand extends defineCommand<UpdateCollectionMembersCommandParam>(
  {
    scope: UseCaseScope.User,
  }
) {}
