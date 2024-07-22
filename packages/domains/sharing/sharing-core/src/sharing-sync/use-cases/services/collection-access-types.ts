import { Permission } from "@dashlane/sharing-contracts";
import { CollectionKeyDecryptionLink } from "../../../sharing-collections/data-access/shared-collections.state";
export interface CollectionAccessData {
  permission: Permission;
  link?: CollectionKeyDecryptionLink;
  otherAdminsFound?: boolean;
}
