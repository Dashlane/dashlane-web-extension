import {
  Permission,
  SharedItemDecryptionLink,
} from "@dashlane/sharing-contracts";
export interface AccessData {
  permission: Permission;
  link?: SharedItemDecryptionLink;
  otherAdminsFound?: boolean;
}
