import { CommandQueryBusConfig } from "Shared/Infrastructure";
import { SessionQueries } from "Session/Api/queries";
import { SessionLiveQueries } from "Session/Api/live-queries";
import { SessionCommands } from "Session/Api/commands";
import {
  activeSpacesSelector,
  analyticsInstallationIdSelector,
  didOpenSelector,
  getCredentialSearchOrderSelector,
  isPaymentFailureChurningDismissedSelector,
  masterPasswordAndServerKeySelector,
  nodePremiumStatusSelector,
  platformNameSelector,
  premiumStatusSelector,
  publicUserIdSelector,
  sessionInfoSelector,
  subscriptionInformationSelector,
  syncIsInProgressSelector,
  syncSelector,
  userCryptoSettingsSelector,
  userLoginSelector,
  webOnboardingModeSelector,
} from "Session/selectors";
import {
  isSSOUserSelector,
  ssoMigrationInfoSelector,
  ssoProviderInfoSelector,
} from "Session/sso.selectors";
import { accountAuthenticationTypeSelector } from "Session/Store/account/selector";
import { getLoginStatus$, loginStatusSelector } from "Session/LoginStatus";
import {
  didOpen$,
  getServiceProviderUrl$,
  premiumStatus$,
  sessionInfo$,
  subscriptionInformation$,
  syncInfo$,
  syncInProgress$,
  webOnboardingMode$,
} from "Session/live";
import {
  resetProtectedItemAutofillTimerHandler,
  validateMasterPasswordHandler,
  validateToken,
} from "Session/performValidation";
import { forceSyncHandler } from "Session/handlers/forceSyncHandler";
import { updatePremiumChurningDismissDateHandler } from "Session/paymentFailure";
import { setCredentialSearchOrderHandler } from "Session/handlers/setCredentialSearchOrderHandler";
import { refreshSubscriptionInformationHandler } from "Session/handlers/refreshSubscriptionInformationHandler";
import { updateAccountRecoveryKeyPersonalSettingsHandler } from "Session/handlers/updateAccountRecoveryKeyPersonalSettingsHandler";
import { isSSOUser$, ssoMigrationInfo$ } from "./sso.lives";
export const config: CommandQueryBusConfig<
  SessionCommands,
  SessionQueries,
  SessionLiveQueries
> = {
  commands: {
    validateToken: { handler: validateToken },
    validateMasterPassword: { handler: validateMasterPasswordHandler },
    resetProtectedItemAutofillTimer: {
      handler: resetProtectedItemAutofillTimerHandler,
    },
    forceSync: { handler: forceSyncHandler },
    updatePremiumChurningDismissDate: {
      handler: updatePremiumChurningDismissDateHandler,
    },
    setCredentialSearchOrder: {
      handler: setCredentialSearchOrderHandler,
    },
    refreshSubscriptionInformation: {
      handler: refreshSubscriptionInformationHandler,
    },
    updateAccountRecoveryKeyPersonalSettings: {
      handler: updateAccountRecoveryKeyPersonalSettingsHandler,
    },
  },
  queries: {
    getActiveSpaces: {
      selector: activeSpacesSelector,
    },
    getMasterPasswordAndServerKey: {
      selector: masterPasswordAndServerKeySelector,
    },
    getSyncInfo: { selector: syncSelector },
    getIsSyncInProgress: { selector: syncIsInProgressSelector },
    getPremiumStatus: { selector: premiumStatusSelector },
    getNodePremiumStatus: { selector: nodePremiumStatusSelector },
    getSubscriptionInformation: {
      selector: subscriptionInformationSelector,
    },
    getIsSSOUser: { selector: isSSOUserSelector },
    getSSOMigrationInfo: { selector: ssoMigrationInfoSelector },
    getSSOProviderInfo: { selector: ssoProviderInfoSelector },
    getUserLogin: { selector: userLoginSelector },
    getPublicUserId: { selector: publicUserIdSelector },
    getAnalyticsInstallationId: {
      selector: analyticsInstallationIdSelector,
    },
    getUserLoginStatus: { selector: loginStatusSelector },
    getLoginStatus: { selector: loginStatusSelector },
    getWebOnboardingMode: { selector: webOnboardingModeSelector },
    getIsPaymentFailureChurningDismissed: {
      selector: isPaymentFailureChurningDismissedSelector,
    },
    getCredentialSearchOrder: {
      selector: getCredentialSearchOrderSelector,
    },
    getDidOpen: {
      selector: didOpenSelector,
    },
    getPlatformName: {
      selector: platformNameSelector,
    },
    getAccountAuthenticationType: {
      selector: accountAuthenticationTypeSelector,
    },
    getSessionInfo: {
      selector: sessionInfoSelector,
    },
    getUserCryptoSettings: {
      selector: userCryptoSettingsSelector,
    },
  },
  liveQueries: {
    liveSyncInfo: { operator: syncInfo$ },
    liveIsSyncInProgress: { operator: syncInProgress$ },
    liveLoginStatus: { operator: getLoginStatus$ },
    livePremiumStatus: { operator: premiumStatus$ },
    liveSubscriptionInformation: { operator: subscriptionInformation$ },
    liveServiceProviderUrl: { subject: getServiceProviderUrl$ },
    liveWebOnboardingMode: { operator: webOnboardingMode$ },
    liveDidOpen: { operator: didOpen$ },
    liveIsSSOUser: { operator: isSSOUser$ },
    liveSSOMigrationInfo: { operator: ssoMigrationInfo$ },
    liveSessionInfo: { operator: sessionInfo$ },
  },
};
