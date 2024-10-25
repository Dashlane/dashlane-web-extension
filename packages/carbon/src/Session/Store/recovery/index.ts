import { Action } from "Store";
import { RecoverySessionData } from "./types";
import {
  RESET_RECOVERY_SESSION_DATA,
  SAVE_RECOVERY_SESSION_DATA,
} from "./actions";
export const getEmptyRecoveryState = (): RecoverySessionData => ({
  recoveryUki: null,
  publicKey: null,
  userServerProtectedSymmetricalKey: null,
  recoveryServerKeyBase64: null,
  recoveryInProgress: false,
  currentPassword: null,
  verificationMethod: null,
});
export default (state = getEmptyRecoveryState(), action: Action) => {
  switch (action.type) {
    case SAVE_RECOVERY_SESSION_DATA:
      return {
        ...state,
        ...action.data,
      };
    case RESET_RECOVERY_SESSION_DATA:
      return getEmptyRecoveryState();
    default:
      return state;
  }
};
