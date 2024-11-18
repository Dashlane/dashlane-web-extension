import type { Transaction } from "Libs/Backup/Transactions/types";
import { KeyPair } from "Libs/WS/Backup/types";
import { Action } from "Store";
import { AnalyticsIds, SessionKeys } from "Session/Store/session/types";
export const REMEMBER_MASTER_PASSWORD_UPDATED =
  "REMEMBER_MASTER_PASSWORD_UPDATED";
export const REMEMBER_ME_FOR_SSO_UPDATED = "REMEMBER_ME_FOR_SSO_UPDATED";
export const UPDATE_KEY_PAIR = "UPDATE_KEY_PAIR";
export const UPDATE_MASTER_PASSWORD = "UPDATE_MASTER_PASSWORD";
export const UPDATE_SERVER_KEY = "UPDATE_SERVER_KEY";
export const UPDATE_LAST_MASTER_PASSWORD_CHECK =
  "UPDATE_LAST_MASTER_PASSWORD_CHECK";
export const UPDATE_CRYPTO_KWC3_FIXED_SALT = "UPDATE_CRYPTO_KWC3_FIXED_SALT";
export const LOAD_SESSION_KEYS = "LOAD_SESSION_KEYS";
export const USE_NEW_AUTH_API = "USE_NEW_AUTH_API";
export const UPDATE_SETTINGS_FOR_MP_VALIDATION =
  "UPDATE_SETTINGS_FOR_MP_VALIDATION";
export const UPDATE_LOCAL_KEY = "UPDATE_LOCAL_KEY";
export const UPDATE_REMOTE_KEY = "UPDATE_REMOTE_KEY";
export const UPDATE_IS_LOCAL_KEY_MIGRATION_REQUIRED =
  "UPDATE_IS_LOCAL_KEY_MIGRATION_REQUIRED";
export const UPDATE_ANALYTICS_IDS = "UPDATE_ANALYTICS_IDS";
export const UPDATE_USER_ANALYTICS_ID = "UPDATE_USER_ANALYTICS_ID";
export const UPDATE_DEVICE_ANALYTICS_ID = "UPDATE_DEVICE_ANALYTICS_ID";
export const UPDATE_PUBLIC_USER_ID = "UPDATE_PUBLIC_USER_ID";
export const LOAD_ANALYTICS_IDS = "LOAD_ANALYTICS_IDS";
export const PAIRING_SUCCEEDED = "PAIRING_SUCCEEDED";
export const UPDATE_SESSION_DID_OPEN = "UPDATE_SESSION_DID_OPEN";
export const UPDATE_IS_USING_AUTHENTICATOR = "UPDATE_IS_USING_AUTHENTICATOR";
export const UPDATE_IS_USING_BACKUP_CODE = "UPDATE_IS_USING_BACKUP_CODE";
export const UPDATE_IS_FIRST_SESSION_AFTER_ACCOUNT_CREATION =
  "UPDATE_IS_FIRST_SESSION_AFTER_ACCOUNT_CREATION";
export const rememberMasterPasswordUpdated = (
  rememberMasterPassword: boolean
) => ({
  type: REMEMBER_MASTER_PASSWORD_UPDATED,
  rememberMasterPassword,
});
export const shouldRememberMeForSSOUpdated = (
  shouldRememberMeForSSO: boolean
) => ({
  type: REMEMBER_ME_FOR_SSO_UPDATED,
  shouldRememberMeForSSO,
});
export const updateKeyPair = (keyPair: KeyPair) => ({
  type: UPDATE_KEY_PAIR,
  keyPair,
});
export const loadSessionKeys = (sessionKeys: SessionKeys) => ({
  type: LOAD_SESSION_KEYS,
  sessionKeys,
});
export const updateServerKey = (serverKey: string) => ({
  type: UPDATE_SERVER_KEY,
  serverKey: serverKey || "",
});
export const updateMasterPassword = (masterPassword: string) => ({
  type: UPDATE_MASTER_PASSWORD,
  masterPassword,
});
export const updateLastMasterPasswordCheck = () => ({
  type: UPDATE_LAST_MASTER_PASSWORD_CHECK,
});
export const updateCryptoKwc3FixedSalt = (
  cryptoKwc3FixedSalt: string
): Action => ({
  type: UPDATE_CRYPTO_KWC3_FIXED_SALT,
  cryptoKwc3FixedSalt,
});
export const updateSettingsForMPValidation = (settings: Transaction) => ({
  type: UPDATE_SETTINGS_FOR_MP_VALIDATION,
  settings,
});
export const updateLocalKey = (localKey: string | null) => ({
  type: UPDATE_LOCAL_KEY,
  localKey,
});
export const updateIsLocalKeyMigrationRequired = (
  isLocalKeyMigrationRequired: boolean
) => ({
  type: UPDATE_IS_LOCAL_KEY_MIGRATION_REQUIRED,
  isLocalKeyMigrationRequired,
});
export const updateRemoteKey = (remoteKey: string | null) => ({
  type: UPDATE_REMOTE_KEY,
  remoteKey,
});
export const loadAnalyticsIds = (analyticsIds: AnalyticsIds) => ({
  type: LOAD_ANALYTICS_IDS,
  userAnalyticsId: analyticsIds.userAnalyticsId,
  deviceAnalyticsId: analyticsIds.deviceAnalyticsId,
});
export const updateAnalyticsIds = (
  userAnalyticsId: string,
  deviceAnalyticsId: string
) => ({
  type: UPDATE_ANALYTICS_IDS,
  userAnalyticsId,
  deviceAnalyticsId,
});
export const updateUserAnalyticsId = (userAnalyticsId: string) => ({
  type: UPDATE_USER_ANALYTICS_ID,
  userAnalyticsId,
});
export const updateDeviceAnalyticsId = (deviceAnalyticsId: string) => ({
  type: UPDATE_DEVICE_ANALYTICS_ID,
  deviceAnalyticsId,
});
export const updatePublicUserId = (publicUserId: string) => ({
  type: UPDATE_PUBLIC_USER_ID,
  publicUserId,
});
export const pairingSucceeded = (pairingId: string) => ({
  type: PAIRING_SUCCEEDED,
  pairingId,
});
export const updateSessionDidOpen = (didOpen: boolean) => ({
  type: UPDATE_SESSION_DID_OPEN,
  didOpen,
});
export const updateisUsingDashlaneAuthenticator = (
  withAuthenticator: boolean
) => ({
  type: UPDATE_IS_USING_AUTHENTICATOR,
  withAuthenticator,
});
export const updateisUsingBackupCode = (withBackupCode: boolean) => ({
  type: UPDATE_IS_USING_BACKUP_CODE,
  withBackupCode,
});
export const updateIsFirstSessionAfterAccountCreation = () => ({
  type: UPDATE_IS_FIRST_SESSION_AFTER_ACCOUNT_CREATION,
});
