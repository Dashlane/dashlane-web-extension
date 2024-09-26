import {
  ClientsOf,
  exceptionLoggingApi,
  featureFlipsApi,
  taskTrackingApi,
  webServicesApi,
} from "@dashlane/framework-contracts";
import { activityLogsApi } from "@dashlane/risk-monitoring-contracts";
import {
  vaultItemsCrudApi,
  vaultOrganizationApi,
} from "@dashlane/vault-contracts";
import { deviceManagementApi } from "@dashlane/device-contracts";
import {
  sharingCollectionsApi,
  sharingInvitesApi,
  sharingItemsApi,
  sharingSyncApi,
} from "@dashlane/sharing-contracts";
import { passwordHealthApi } from "@dashlane/password-security-contracts";
import { carbonLegacyApi } from "./carbon-legacy-contracts/carbon-legacy-api";
import {
  AuthenticationFlowContracts,
  DeviceTransferContracts,
  pinCodeApi,
} from "@dashlane/authentication-contracts";
import {
  changeMasterPasswordApi,
  sessionApi,
} from "@dashlane/session-contracts";
import { masterPasswordSecurityApi } from "@dashlane/master-password-contracts";
const availableApis = {
  sharingItemsApi,
  taskTrackingApi,
  activityLogsApi,
  vaultItemsCrudApi,
  deviceManagementApi,
  authenticationFlowApi: AuthenticationFlowContracts.authenticationFlowApi,
  deviceTransferApi: DeviceTransferContracts.deviceTransferApi,
  pinCodeApi,
  sessionApi,
  masterPasswordSecurityApi,
  passwordHealthApi,
  carbonLegacyApi,
  changeMasterPasswordApi,
  sharingCollectionsApi,
  sharingInvitesApi,
  sharingSyncApi,
  vaultOrganizationApi,
  featureFlipsApi,
  webServicesApi,
  exceptionLoggingApi,
};
type AvailableApis = typeof availableApis;
export type ApplicationsModulesDependencies = {
  [k in keyof AvailableApis as AvailableApis[k]["name"]]: AvailableApis[k];
};
export type ModuleClients = ClientsOf<ApplicationsModulesDependencies>;
export type ApplicationModulesAccessInitOption = () => ModuleClients;
export interface ApplicationModulesAccess {
  createClients: () => ModuleClients;
}
