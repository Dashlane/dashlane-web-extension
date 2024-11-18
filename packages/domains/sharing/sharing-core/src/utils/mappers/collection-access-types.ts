import { Permission } from "@dashlane/sharing-contracts";
import { CollectionKeyDecryptionLink } from "../../sharing-collections/data-access/shared-collections.state";
export interface CollectionAccessData {
  permission: Permission;
  isAccepted: boolean;
  link?: CollectionKeyDecryptionLink;
  otherAdminsFound?: boolean;
}
export enum SharedCollectionAccessLinkTypes {
  User = "user",
  UserGroup = "group",
}
