import { ChangeMPFlowPath } from "@dashlane/communication";
import { CoreServices } from "Services";
import { resetRecoverySessionData } from "Session/Store/recovery/actions";
import {
  resetSSOSettings,
  storeSSOSettings,
} from "Session/Store/ssoSettings/actions";
export const resetMigrationState = async (
  services: CoreServices,
  flow: ChangeMPFlowPath
) => {
  if (
    flow === ChangeMPFlowPath.USER_CHANGING_MP ||
    flow === ChangeMPFlowPath.TO_EMAIL_TOKEN ||
    flow === ChangeMPFlowPath.ACCOUNT_RECOVERY_KEY
  ) {
    return;
  }
  const { storeService } = services;
  storeService.dispatch(resetRecoverySessionData());
  storeService.dispatch(resetSSOSettings());
  if (flow === ChangeMPFlowPath.MP_TO_SSO) {
    storeService.dispatch(storeSSOSettings({ ssoUser: true }));
  }
};
