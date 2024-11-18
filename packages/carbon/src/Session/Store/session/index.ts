import type { Transaction } from "Libs/Backup/Transactions/types";
import generateRandomSessionId from "Utils/generateRandomSessionId/index";
import { OPEN_SESSION } from "Session/Store/actions";
import {
  LOAD_ANALYTICS_IDS,
  LOAD_SESSION_KEYS,
  PAIRING_SUCCEEDED,
  REMEMBER_MASTER_PASSWORD_UPDATED,
  REMEMBER_ME_FOR_SSO_UPDATED,
  UPDATE_ANALYTICS_IDS,
  UPDATE_CRYPTO_KWC3_FIXED_SALT,
  UPDATE_DEVICE_ANALYTICS_ID,
  UPDATE_IS_FIRST_SESSION_AFTER_ACCOUNT_CREATION,
  UPDATE_IS_LOCAL_KEY_MIGRATION_REQUIRED,
  UPDATE_IS_USING_AUTHENTICATOR,
  UPDATE_IS_USING_BACKUP_CODE,
  UPDATE_KEY_PAIR,
  UPDATE_LAST_MASTER_PASSWORD_CHECK,
  UPDATE_LOCAL_KEY,
  UPDATE_MASTER_PASSWORD,
  UPDATE_PUBLIC_USER_ID,
  UPDATE_REMOTE_KEY,
  UPDATE_SERVER_KEY,
  UPDATE_SESSION_DID_OPEN,
  UPDATE_SETTINGS_FOR_MP_VALIDATION,
  UPDATE_USER_ANALYTICS_ID,
} from "Session/Store/session/actions";
import { KeyPair } from "Libs/WS/Backup/types";
import { CONFIRM_USER_AUTHENTICATION } from "Session/Store/account/actions";
import { AnalyticsIds, SessionKeys } from "./types";
export interface Session {
  sessionId: number;
  rememberMasterPassword: boolean;
  shouldRememberMeForSSO: boolean;
  masterPassword: string | null;
  remoteKey: string | null;
  localKey: string | null;
  lastMasterPasswordCheck: number;
  serverKey: string;
  keyPair: KeyPair | null;
  cryptoKwc3FixedSalt: string;
  sessionKeys: SessionKeys;
  settingsForMPValidation: Transaction | null;
  isLocalKeyMigrationRequired: boolean;
  analyticsIds: AnalyticsIds;
  publicUserId: string;
  pairingId: string | null;
  didOpen: boolean;
  isUsingDashlaneAuthenticator: boolean;
  isUsingBackupCode: boolean;
  isFirstSessionAfterAccountCreation: boolean;
}
function getEmptySession(): Session {
  return {
    sessionId: null,
    rememberMasterPassword: null,
    shouldRememberMeForSSO: null,
    masterPassword: null,
    remoteKey: null,
    localKey: null,
    lastMasterPasswordCheck: 0,
    serverKey: "",
    keyPair: null,
    cryptoKwc3FixedSalt: null,
    sessionKeys: null,
    settingsForMPValidation: null,
    isLocalKeyMigrationRequired: false,
    analyticsIds: {
      userAnalyticsId: "",
      deviceAnalyticsId: "",
    },
    publicUserId: "",
    pairingId: null,
    didOpen: false,
    isUsingDashlaneAuthenticator: false,
    isUsingBackupCode: false,
    isFirstSessionAfterAccountCreation: false,
  };
}
export default (state = getEmptySession(), action: any) => {
  switch (action.type) {
    case OPEN_SESSION:
      return {
        ...state,
        sessionId: generateRandomSessionId(),
      };
    case UPDATE_KEY_PAIR:
      return {
        ...state,
        keyPair: action.keyPair,
      };
    case REMEMBER_MASTER_PASSWORD_UPDATED:
      return {
        ...state,
        rememberMasterPassword: action.rememberMasterPassword,
      };
    case REMEMBER_ME_FOR_SSO_UPDATED:
      return {
        ...state,
        shouldRememberMeForSSO: action.shouldRememberMeForSSO,
      };
    case UPDATE_MASTER_PASSWORD:
      return {
        ...state,
        masterPassword: action.masterPassword ?? null,
      };
    case LOAD_SESSION_KEYS:
      return {
        ...state,
        sessionKeys: action.sessionKeys,
      };
    case UPDATE_SERVER_KEY:
      return {
        ...state,
        serverKey: action.serverKey,
      };
    case UPDATE_LAST_MASTER_PASSWORD_CHECK:
      return {
        ...state,
        lastMasterPasswordCheck: Date.now(),
      };
    case UPDATE_CRYPTO_KWC3_FIXED_SALT:
      return {
        ...state,
        cryptoKwc3FixedSalt: action.cryptoKwc3FixedSalt,
      };
    case CONFIRM_USER_AUTHENTICATION:
      return {
        ...state,
        settingsForMPValidation: null,
      };
    case UPDATE_SETTINGS_FOR_MP_VALIDATION:
      return {
        ...state,
        settingsForMPValidation: action.settings,
      };
    case UPDATE_LOCAL_KEY:
      if (state.localKey !== action.localKey) {
        return {
          ...state,
          localKey: action.localKey,
        };
      }
      return state;
    case UPDATE_REMOTE_KEY:
      if (state.remoteKey !== action.remoteKey) {
        return {
          ...state,
          remoteKey: action.remoteKey,
        };
      }
      return state;
    case UPDATE_IS_LOCAL_KEY_MIGRATION_REQUIRED:
      return {
        ...state,
        isLocalKeyMigrationRequired: action.isLocalKeyMigrationRequired,
      };
    case LOAD_ANALYTICS_IDS:
    case UPDATE_ANALYTICS_IDS:
      return {
        ...state,
        analyticsIds: {
          userAnalyticsId: action.userAnalyticsId,
          deviceAnalyticsId: action.deviceAnalyticsId,
        },
      };
    case UPDATE_USER_ANALYTICS_ID:
      return {
        ...state,
        analyticsIds: {
          ...state.analyticsIds,
          userAnalyticsId: action.userAnalyticsId,
        },
      };
    case UPDATE_DEVICE_ANALYTICS_ID:
      return {
        ...state,
        analyticsIds: {
          ...state.analyticsIds,
          deviceAnalyticsId: action.deviceAnalyticsId,
        },
      };
    case UPDATE_PUBLIC_USER_ID:
      return {
        ...state,
        publicUserId: action.publicUserId,
      };
    case PAIRING_SUCCEEDED:
      return {
        ...state,
        pairingId: action.pairingId,
      };
    case UPDATE_SESSION_DID_OPEN: {
      return {
        ...state,
        didOpen: action.didOpen,
      };
    }
    case UPDATE_IS_USING_AUTHENTICATOR: {
      return {
        ...state,
        isUsingDashlaneAuthenticator: action.withAuthenticator,
      };
    }
    case UPDATE_IS_USING_BACKUP_CODE: {
      return {
        ...state,
        isUsingBackupCode: action.withBackupCode,
      };
    }
    case UPDATE_IS_FIRST_SESSION_AFTER_ACCOUNT_CREATION: {
      return {
        ...state,
        isFirstSessionAfterAccountCreation: true,
      };
    }
    default:
      return state;
  }
};
