export const SAVE_RECOVERY_SESSION_DATA = "SAVE_RECOVERY_SESSION_DATA";
export const RESET_RECOVERY_SESSION_DATA = "RESET_RECOVERY_SESSION_DATA";
import { RecoverySessionData } from "./types";
export const saveRecoverySessionData = (data: RecoverySessionData) => {
  return {
    type: SAVE_RECOVERY_SESSION_DATA,
    data,
  };
};
export const resetRecoverySessionData = () => {
  return {
    type: RESET_RECOVERY_SESSION_DATA,
  };
};
