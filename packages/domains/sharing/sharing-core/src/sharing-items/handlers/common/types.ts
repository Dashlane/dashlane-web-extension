import { ShareableItemType } from "@dashlane/sharing-contracts";
import {
  AuditLogData,
  UserGroupInvite,
  UserInvite,
} from "../../../sharing-common";
export interface ShareItemModel {
  sharedItemId: string;
  revision: number;
  auditLogData?: AuditLogData;
  title: string;
  itemType: ShareableItemType;
}
export interface ShareItemInvitesModel {
  sharedItem: ShareItemModel;
  users?: UserInvite[];
  userGroups?: UserGroupInvite[];
}
