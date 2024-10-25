import { createSelector } from "reselect";
import { ApplicationBuildType, CredentialSearchOrder, MasterPasswordServerKeyResponse, NodePremiumStatus, PersonalSettings, PremiumStatus, PremiumStatusSpace, SessionInfo, Space, SubscriptionInformation, SyncState, SyncStatuses, UserCryptoSettings, } from "@dashlane/communication";
import { State } from "Store";
import { SharingSyncState } from "Session/Store/sharingSync";
import { KeyPair } from "Libs/WS/Backup/types";
import { AuthTicketInfo } from "Session/Store/authTicket/types";
import { deviceKeysSelector, platformInfoSelector, } from "Authentication/selectors";
import { AnalyticsIds, SessionEncryptorKeys, } from "Session/Store/session/types";
import { getCommonAppSetting } from "Application/ApplicationSettings";
import { *** } from "UserManagement/is-internal-test-user";
const ONE_DAY_IN_MILLISECONDS = 24 * 60 * 60 * 1000;
const isTimestampOlderThanADay = (date: number): boolean => Date.now() - date > ONE_DAY_IN_MILLISECONDS;
export const syncSelector = (state: State): SyncState => state.userSession.sync;
export const syncIsInProgressSelector = (state: State): boolean => state.userSession.sync.status === SyncStatuses.IN_PROGRESS;
export const premiumStatusSelector = (state: State): PremiumStatus | null => state.userSession.localSettings.premiumStatus;
export const nodePremiumStatusSelector = (state: State): NodePremiumStatus | null => state.userSession.localSettings.nodePremiumStatus;
export const subscriptionInformationSelector = (state: State): SubscriptionInformation | null => state.userSession.localSettings.subscriptionInformation;
export const activeSpacesSelector = (state: State): PremiumStatusSpace[] => {
    const premiumStatus = premiumStatusSelector(state);
    const spaces = (premiumStatus && premiumStatus.spaces) || [];
    return spaces.filter((space) => space.status === "accepted");
};
export const userIdSelector = (state: State): string => state.userSession.account.login;
export const masterPasswordAndServerKeySelector = (state: State): MasterPasswordServerKeyResponse => {
    const { userSession } = state;
    const { masterPassword, serverKey } = userSession.session;
    return {
        password: masterPassword,
        serverKey: serverKey,
    };
};
export const masterPasswordSelector = (state: State): string => {
    return state.userSession.session.masterPassword;
};
export const userLoginSelector = (state: State): string | null => state.userSession.account.login;
export const spacesSelector = (state: State) => state.userSession.spaceData.spaces;
export const masterPasswordValidationDataSelector = (state: State) => state.userSession.session.settingsForMPValidation;
export const webOnboardingModeSelector = (state: State) => state.userSession.localSettings.webOnboardingMode;
export const isLocalKeyActivatedSelector = (state: State): boolean => Boolean(state.userSession.session.localKey);
export const localKeySelector = (state: State): string => state.userSession.session.localKey;
const combineAutologinDomainDisabledArray = (spaces: Space[]) => spaces.reduce((prev, curr) => {
    let list = [];
    const validArray = curr &&
        curr.details &&
        curr.details.info &&
        curr.details.info.autologinDomainDisabledArray;
    if (validArray) {
        list = curr.details.info.autologinDomainDisabledArray;
    }
    return [...prev, ...list];
}, []);
export const spaceDisabledDomainsListSelector = createSelector(spacesSelector, combineAutologinDomainDisabledArray);
export const serverKeySelector = (state: State): string => state.userSession.session.serverKey;
export const isRemoteKeyActivatedSelector = (state: State): boolean => Boolean(state.userSession.session.remoteKey);
export const remoteKeySelector = (state: State): string => state.userSession.session.remoteKey;
export const isLocalKeyMigrationRequiredSelector = (state: State): boolean => state.userSession.session.isLocalKeyMigrationRequired;
export const anonymousUserIdSelector = (state: State): string => state.userSession.personalSettings.AnonymousUserId;
export const userDefaultCryptoSelector = (state: State): string | null => state.userSession.personalSettings.CryptoUserPayload;
export const userCryptoFixedSalt = (state: State): string | null => state.userSession.personalSettings.CryptoFixedSalt;
export const accountRecoveryOptInSelector = (state: State): boolean => state.userSession.personalSettings.RecoveryOptIn || false;
export const recoveryKeySelector = (state: State): string | undefined => state.userSession.personalSettings.RecoveryKey;
export const sharingSyncSelector = (state: State): SharingSyncState => state.userSession.sharingSync;
export const sharingKeysSelector = (state: State): KeyPair | null => state.userSession.session.keyPair;
export const authTicketInfoSelector = (state: State): AuthTicketInfo => state.userSession.authTicketInfo;
export const personalSettingsSelector = (state: State): PersonalSettings => state.userSession.personalSettings;
export const protectPasswordsSettingSelector = (state: State): boolean => {
    const { ProtectPasswords } = state.userSession.personalSettings;
    return ProtectPasswords;
};
export const richIconsSettingSelector = (state: State): boolean => {
    const space = state.userSession.spaceData.spaces.find((space) => space.details.status === "accepted");
    if (space) {
        const richIconsEnabledInTac = space.details?.info?.richIconsEnabled;
        if (!richIconsEnabledInTac) {
            return false;
        }
    }
    const { RichIcons } = state.userSession.personalSettings;
    return RichIcons;
};
export const isAuthenticatedSelector = (state: State): boolean => state.userSession.account.isAuthenticated;
export const appVersionSelector = (state: State): string => platformInfoSelector(state).appVersion;
export const platformNameSelector = (state: State): string => platformInfoSelector(state).platformName;
export const applicationBuildTypeSelector = (state: State): ApplicationBuildType => platformInfoSelector(state).buildType;
export const analyticsIdsSelector = (state: State): AnalyticsIds => state.userSession.session.analyticsIds;
export const publicUserIdSelector = (state: State): string => state.userSession.session.publicUserId;
export const didOpenSelector = (state: State): boolean => state.userSession.session.didOpen;
export const lastMasterPasswordCheckSelector = (state: State): number => state.userSession.session.lastMasterPasswordCheck;
export const isPaymentFailureChurningDismissedSelector = (state: State): boolean => isTimestampOlderThanADay(state.userSession.localSettings.premiumChurningDismissDate);
export const analyticsInstallationIdSelector = createSelector(userLoginSelector, isAuthenticatedSelector, applicationBuildTypeSelector, filterViewableInstallationId);
export const getCredentialSearchOrderSelector = (state: State): CredentialSearchOrder => {
    return (state.userSession.localSettings.credentialSearchOrder ??
        CredentialSearchOrder.NAME);
};
export const sessionEncryptorKeysSelector = (state: State): SessionEncryptorKeys => ({
    masterPassword: masterPasswordSelector(state),
    serverKey: serverKeySelector(state),
    localKey: localKeySelector(state),
    remoteKey: remoteKeySelector(state),
});
export const sessionInfoSelector = (state: State): SessionInfo => ({
    password: masterPasswordSelector(state),
    serverKey: serverKeySelector(state),
    localKey: localKeySelector(state),
    cryptoUserPayload: userDefaultCryptoSelector(state),
    cryptoFixedSalt: userCryptoFixedSalt(state),
    devicesKeys: deviceKeysSelector(state),
});
export const userCryptoSettingsSelector = (state: State): UserCryptoSettings => ({
    cryptoUserPayload: state.userSession.personalSettings.CryptoUserPayload,
    cryptoFixedSalt: state.userSession.personalSettings.CryptoFixedSalt,
});
