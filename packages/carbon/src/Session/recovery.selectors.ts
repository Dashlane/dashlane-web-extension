import { State } from "Store/types";
import { RecoverySessionData } from "Session/Store/recovery/types";
export const recoveryUkiSelector = (state: State): string | undefined =>
  state.userSession.recoveryData.recoveryUki;
export const recoveryDataSelector = (state: State): RecoverySessionData =>
  state.userSession.recoveryData;
export const recoveryInProgressSelector = (state: State): boolean | null =>
  state.userSession.recoveryData.recoveryInProgress;
export const recoveryIsOtpSelector = (state: State): boolean => {
  const otpTypes = ["totp", "duo_push", "u2f"];
  const verificationType =
    state.userSession.recoveryData.verificationMethod[0]?.type ?? "";
  return otpTypes.includes(verificationType);
};
