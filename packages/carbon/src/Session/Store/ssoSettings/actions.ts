import { Action } from "Store";
import {
  getEmptySSOSettings,
  SET_SSO_SETTINGS,
} from "Session/Store/ssoSettings";
import { SSOSettingsData } from "@dashlane/communication";
export interface UserGroupsCreatedAction extends Action {
  ssoSettingsData: SSOSettingsData;
}
export const storeSSOSettings = (
  ssoSettingsData: Partial<SSOSettingsData>
): Action => ({
  type: SET_SSO_SETTINGS,
  data: ssoSettingsData,
});
export const resetSSOSettings = (): Action => ({
  type: SET_SSO_SETTINGS,
  data: getEmptySSOSettings(),
});
