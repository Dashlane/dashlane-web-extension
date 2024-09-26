export enum CryptoMigrationApiErrorType {
  ChangeUserCryptoFailed = "CHANGE_USER_CRYPTO_FAILED",
}
export interface ChangeUserCryptoParams {
  newDerivationMethod: SupportedDerivationMethods;
}
export type ChangeUserCryptoResult =
  | ChangeUserCryptoSuccess
  | ChangeUserCryptoError;
interface ChangeUserCryptoSuccess {
  success: true;
}
interface ChangeUserCryptoError {
  success: false;
  error: {
    code: CryptoMigrationApiErrorType.ChangeUserCryptoFailed;
    message?: string;
  };
}
export enum SupportedDerivationMethods {
  ARGON2D = "argon2d",
  PBKDF2 = "pbkdf2",
  KWC3 = "kwc3",
}
export type MigrateUserCryptoResult = ChangeUserCryptoResult;
