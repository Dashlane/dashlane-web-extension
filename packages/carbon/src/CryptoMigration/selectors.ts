import { pipe } from "rxjs";
import { distinctUntilChanged, map } from "rxjs/operators";
import { SupportedDerivationMethods } from "@dashlane/communication";
import { activeSpacesSelector } from "DataManagement/Spaces/selectors";
import {
  ARGON2_DEFAULT_PAYLOAD,
  CryptoPayload,
  KWC3_DEFAULT_PAYLOAD,
  PBKDF2_DEFAULT_PAYLOAD,
} from "Libs/CryptoCenter/transportable-data";
import { userDefaultCryptoSelector } from "Session/selectors";
import { StateOperator } from "Shared/Live/types";
import { State } from "Store";
export const teamCryptoForcedPayloadSelector = (
  state: State
): CryptoPayload => {
  const teamSpace = activeSpacesSelector(state)[0];
  return teamSpace?.details.info.cryptoForcedPayload ?? "";
};
export const canUserSelectCryptoSelector = (state: State): boolean => {
  const adminEnforcedCrypto = teamCryptoForcedPayloadSelector(state);
  return !adminEnforcedCrypto;
};
export const userDerivationMethodSelector = (
  state: State
): SupportedDerivationMethods | null => {
  const cryptoUserPayload = userDefaultCryptoSelector(state);
  switch (cryptoUserPayload) {
    case ARGON2_DEFAULT_PAYLOAD:
      return SupportedDerivationMethods.ARGON2D;
    case PBKDF2_DEFAULT_PAYLOAD:
      return SupportedDerivationMethods.PBKDF2;
    case KWC3_DEFAULT_PAYLOAD:
      return SupportedDerivationMethods.KWC3;
    default:
      return null;
  }
};
export const userDerivationMethodSelector$ =
  (): StateOperator<SupportedDerivationMethods | null> =>
    pipe(map(userDerivationMethodSelector), distinctUntilChanged());
