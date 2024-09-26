import { SupportedDerivationMethods } from "@dashlane/communication";
import {
  ARGON2_DEFAULT_PAYLOAD,
  CryptoPayload,
  KWC3_DEFAULT_PAYLOAD,
  PBKDF2_DEFAULT_PAYLOAD,
} from "Libs/CryptoCenter/transportable-data";
export function getNewCryptoPayload(
  derivationMethode: SupportedDerivationMethods
): CryptoPayload | undefined {
  switch (derivationMethode) {
    case SupportedDerivationMethods.ARGON2D:
      return ARGON2_DEFAULT_PAYLOAD;
    case SupportedDerivationMethods.PBKDF2:
      return PBKDF2_DEFAULT_PAYLOAD;
    case SupportedDerivationMethods.KWC3:
      return KWC3_DEFAULT_PAYLOAD;
    default:
      return undefined;
  }
}
