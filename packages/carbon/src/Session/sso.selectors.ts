import { AuthenticationFlowContracts } from "@dashlane/authentication-contracts";
import { createSelector } from "reselect";
import { State } from "Store";
import { activeSpacesSelector } from "Session/selectors";
import { SSOSettingsData } from "@dashlane/communication";
export const ssoSettingsSelector = (state: State): SSOSettingsData =>
  state.userSession.ssoSettings;
export const serviceProviderUrlSelector = (state: State) =>
  ssoSettingsSelector(state).serviceProviderUrl;
export const ssoMigrationInfoSelector = createSelector(
  ssoSettingsSelector,
  ({ migration, serviceProviderUrl, ssoToken }) => {
    return {
      migration: ssoToken
        ? AuthenticationFlowContracts.SSOMigrationType.MP_TO_SSO_WITH_INFO
        : migration,
      serviceProviderUrl,
    };
  }
);
export const ssoProviderInfoSelector = createSelector(
  ssoSettingsSelector,
  ({ serviceProviderUrl, isNitroProvider }) => {
    return {
      serviceProviderUrl,
      isNitroProvider,
    };
  }
);
export const isSSOUserSelector = (state: State): boolean => {
  const activeSpaces = activeSpacesSelector(state);
  return (activeSpaces.length > 0 && activeSpaces[0].isSSOUser) || false;
};
