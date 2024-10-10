import {
  LocalAccountInfo,
  PlatformInfo,
  PublicKeyCredentialDescriptorJSON,
  RememberMeType,
} from "@dashlane/communication";
import { State } from "Store";
import { AppKeys } from "Session/Store/sdk/types";
import {
  convertDeviceKeysToUki,
  convertUkiToDeviceKeys,
  DeviceKeys,
} from "Store/helpers/Device";
import { SessionKeys } from "Session/Store/session/types";
import { getCommonAppSetting } from "Application/ApplicationSettings";
import { LocalUsersAuthenticationState } from "Authentication/Store/localUsers/types";
import { ReactivationStatus } from "Authentication/Store/localAccounts/types";
import { CurrentUserAuthenticationState } from "Authentication/Store/currentUser/types";
import { AuthenticatorDetails } from "Authentication/Store/webAuthn/types";
import { OtpType } from "Session/Store/account";
import { firstValueFrom, map } from "rxjs";
import { getSuccessOrThrow } from "@dashlane/framework-types";
import { SessionClient } from "@dashlane/session-contracts";
export const appKeysSelector = (state: State): AppKeys | null =>
  state.userSession.sdkAuthentication.appKeys;
export const dashlaneServerDeltaTimestampSelector = (
  state: State
): number | null =>
  state.userSession.sdkAuthentication.dashlaneServerDeltaTimestamp;
export const ukiSelector = (state: State): string | null => {
  const uki = state.userSession.localSettings.uki;
  if (uki) {
    return uki;
  }
  return (
    (state.authentication.currentUser &&
      state.authentication.currentUser.deviceKeys &&
      convertDeviceKeysToUki(state.authentication.currentUser.deviceKeys)) ||
    null
  );
};
export const getUkiFromSession = ({
  queries: { currentSessionInfo },
}: SessionClient) => {
  return firstValueFrom(
    currentSessionInfo().pipe(
      map(getSuccessOrThrow),
      map((v) => convertDeviceKeysToUki(v.deviceKeys))
    )
  );
};
export const deviceKeysSelector = (state: State): DeviceKeys | null => {
  if (
    state.authentication.currentUser &&
    state.authentication.currentUser.deviceKeys
  ) {
    return state.authentication.currentUser.deviceKeys;
  }
  const uki = state.userSession.localSettings.uki;
  return convertUkiToDeviceKeys(uki);
};
export const getDeviceKeysFromSession = ({
  queries: { currentSessionInfo },
}: SessionClient) => {
  return firstValueFrom(
    currentSessionInfo().pipe(
      map(getSuccessOrThrow),
      map((v) => v.deviceKeys)
    )
  );
};
const getDeviceIdSelector = (state: State, login: string): string | null => {
  const localUserAuthSlice = state.authentication.localUsers[login];
  if (localUserAuthSlice && localUserAuthSlice.deviceAccessKey) {
    return localUserAuthSlice.deviceAccessKey;
  }
  return getCommonAppSetting("deviceId") || null;
};
export const getDeviceAccessKeySelector = (
  state: State,
  login: string
): string | null => {
  return getDeviceIdSelector(state, login);
};
export const getDeviceAccessKeysFromSession = (
  { queries: { localSessions } }: SessionClient,
  login: string
) => {
  return firstValueFrom(
    localSessions().pipe(
      map(getSuccessOrThrow),
      map((v) => v[login]?.deviceAccessKey)
    )
  );
};
export const sessionKeysSelector = ({
  userSession: { session },
}: State): SessionKeys | null => {
  const hasSessionKeys = Boolean(
    session.sessionKeys &&
      session.sessionKeys.accessKey &&
      session.sessionKeys.secretKey
  );
  return hasSessionKeys ? { ...session.sessionKeys } : null;
};
export const getUserDeviceWasRegisteredWithDeviceKeysSelector = (
  state: State,
  login: string
): boolean => {
  const localUserAuthSlice = state.authentication.localUsers[login];
  if (localUserAuthSlice) {
    return !localUserAuthSlice.deviceRegisteredWithLegacyKey;
  }
  return false;
};
export const localAccountsListSelector = (state: State): LocalAccountInfo[] =>
  state.authentication.localAccounts.accountsList;
export const localAccountsInitializedSelector = (state: State): boolean =>
  state.authentication.localAccounts.accountsListInitialized;
export const localUsersAuthenticationDataSelector = (
  state: State
): LocalUsersAuthenticationState => state.authentication.localUsers;
export const userAuthenticationDataSelector = (
  state: State
): CurrentUserAuthenticationState => state.authentication.currentUser;
export const otpTypeSelector = (state: State): OtpType | null =>
  state.userSession?.account ? state.userSession.account.otpType : null;
export const hasOtp2TypeSelector = (state: State): boolean => {
  const otpType = otpTypeSelector(state);
  if (otpType === OtpType.OTP_LOGIN) {
    return true;
  }
  return false;
};
export const platformInfoSelector = (state: State): PlatformInfo =>
  state.device.platform.info;
export const webAuthnUserIdSelector = (state: State): string | null =>
  state.authentication.webAuthnAuthentication.webAuthnUserId;
export const authenticatorsSelector = (state: State): AuthenticatorDetails[] =>
  state.authentication.webAuthnAuthentication.authenticators;
export const authenticatorsAsCredentialSelector = (
  state: State
): PublicKeyCredentialDescriptorJSON[] => {
  const authenticators = authenticatorsSelector(state);
  return authenticators.map((authenticator) => ({
    id: authenticator.credentialId,
    type: "public-key",
  }));
};
export const rememberMeTypeSelector = (state: State): RememberMeType =>
  state.authentication.currentUser.rememberMeType;
export const webAuthnAuthenticationOptedInSelector = (state: State): boolean =>
  rememberMeTypeSelector(state) === "webauthn";
export const rememberMeFor14DaysOptedInSelector = (state: State): boolean =>
  rememberMeTypeSelector(state) === "autologin";
export const reactivationStatusSelector = (state: State): ReactivationStatus =>
  state.authentication.localAccounts.reactivationStatus;
