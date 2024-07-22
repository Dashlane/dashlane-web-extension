import { defineCommand, UseCaseScope } from "@dashlane/framework-contracts";
import {
  defineFunctionalError,
  FunctionalErrorOf,
} from "@dashlane/framework-types";
import {
  SharedCollectionUserGroupRecipient,
  SharedCollectionUserRecipient,
} from "../sharing-collections.types";
import { Permission } from "../../common-types";
export interface CreateSharedCollectionCommandParam {
  collectionName: string;
  teamId: string;
  users: SharedCollectionUserRecipient[];
  groups: SharedCollectionUserGroupRecipient[];
  itemIds: string[];
  defaultItemPermissions: Permission;
  privateCollectionId?: string;
}
export const ATTACHMENT_IN_COLLECTION = "ATTACHMENT_IN_COLLECTION";
export const createAttachmentInCollectionError = defineFunctionalError(
  ATTACHMENT_IN_COLLECTION,
  "Unable to share collections containing secure notes with attachments."
);
export type AttachmentInCollectionError = FunctionalErrorOf<
  typeof ATTACHMENT_IN_COLLECTION
>;
export class CreateSharedCollectionCommand extends defineCommand<
  CreateSharedCollectionCommandParam,
  undefined,
  AttachmentInCollectionError
>({
  scope: UseCaseScope.User,
}) {}
