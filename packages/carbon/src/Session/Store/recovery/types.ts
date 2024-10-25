import { VerificationMethod } from "Libs/DashlaneApi/services/authentication/common-types";
export interface RecoverySessionData {
  recoveryUki?: string | null;
  publicKey?: string | null;
  userServerProtectedSymmetricalKey?: string | null;
  recoveryServerKeyBase64?: string | null;
  recoveryInProgress?: boolean;
  currentPassword?: string | null;
  verificationMethod?: Array<VerificationMethod>;
}
