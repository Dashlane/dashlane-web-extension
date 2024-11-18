import {
  AdminProvisioningKeyData,
  BasicConfig,
  AdminData as comAdminData,
  MassDeploymentTeamKeyData,
} from "@dashlane/communication";
import {
  ItemGroupDownload,
  UserGroupDownload,
} from "@dashlane/sharing/types/serverResponse";
export interface AdminItemBase {
  itemId: string;
}
export interface UserGroupAdminItem extends AdminItemBase {
  groupId: string;
  groupKey: string;
}
export interface DirectorySyncKey extends AdminItemBase {
  publicKey: string;
}
export interface SSOConnectorKey extends AdminItemBase {
  ssoConnectorKey: string;
}
export interface SCIMSignatureKey extends AdminItemBase {
  scimSignatureKey: string;
}
export interface AdminProvisioningKeyItem
  extends AdminItemBase,
    AdminProvisioningKeyData {}
export interface MassDeploymentTeamKeyItem
  extends AdminItemBase,
    MassDeploymentTeamKeyData {}
export interface ESConfigsSpecialItem extends AdminItemBase {
  basicConfigs?: BasicConfig[];
}
export type AdminItem =
  | UserGroupAdminItem
  | DirectorySyncKey
  | ESConfigsSpecialItem
  | SSOConnectorKey
  | SCIMSignatureKey
  | MassDeploymentTeamKeyItem;
export interface AdminData extends comAdminData {
  teamId: string;
  specialItemGroup?: ItemGroupDownload;
  specialUserGroup?: UserGroupDownload;
  userGroups?: UserGroupDownload[];
  userGroupAdminItems?: UserGroupAdminItem[];
  directorySyncInProgress?: boolean;
  directorySyncKey?: DirectorySyncKey | null;
  encryptionServiceData?: ESConfigsSpecialItem | null;
  ssoConnectorKey?: SSOConnectorKey | null;
  scimSignatureKey?: SCIMSignatureKey | null;
  adminProvisioningKey?: AdminProvisioningKeyItem | null;
  massDeploymentTeamKey?: MassDeploymentTeamKeyItem | null;
}
export interface TeamAdminDataDictionary {
  [teamId: string]: AdminData;
}
export interface TeamAdminData {
  teams: TeamAdminDataDictionary;
}
