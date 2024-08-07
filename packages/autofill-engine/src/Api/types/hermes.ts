import { VaultSourceType } from "@dashlane/autofill-contracts";
import {
  AlgorithmsSupported,
  AuthenticationMediationType,
  AutofillMessageType,
  FormType,
  AuthenticatorAttachment as hermesAuthenticatorAttachment,
  AuthenticatorResidentKey as hermesAuthenticatorResidentKey,
  AuthenticatorUserVerification as hermesAuthenticatorUserVerification,
  ItemType,
  PasskeyAuthenticationErrorType,
  PasskeyRegistrationErrorType,
} from "@dashlane/hermes";
import { FormLabelsType } from "../../config/labels/labels";
import { WebauthnErrorName } from "./webauthn";
import { AutofillDropdownWebcardWarningType } from "./webcards/autofill-dropdown-webcard";
export function mapOptional<K extends string, T>(
  value: K | undefined,
  map: Record<K, T>
): T | undefined {
  return value !== undefined ? map[value] : undefined;
}
export const vaultSourceTypeToHermesItemTypeMap: Partial<
  Record<VaultSourceType, ItemType>
> = {
  [VaultSourceType.Address]: ItemType.Address,
  [VaultSourceType.BankAccount]: ItemType.BankStatement,
  [VaultSourceType.Company]: ItemType.Company,
  [VaultSourceType.Credential]: ItemType.Credential,
  [VaultSourceType.DriverLicense]: ItemType.DriverLicence,
  [VaultSourceType.Email]: ItemType.Email,
  [VaultSourceType.FiscalId]: ItemType.FiscalStatement,
  [VaultSourceType.GeneratedPassword]: ItemType.GeneratedPassword,
  [VaultSourceType.IdCard]: ItemType.IdCard,
  [VaultSourceType.Identity]: ItemType.Identity,
  [VaultSourceType.Passkey]: ItemType.Passkey,
  [VaultSourceType.Passport]: ItemType.Passport,
  [VaultSourceType.PaymentCard]: ItemType.CreditCard,
  [VaultSourceType.PersonalWebsite]: ItemType.Website,
  [VaultSourceType.Phone]: ItemType.Phone,
  [VaultSourceType.SocialSecurityId]: ItemType.SocialSecurity,
};
export const formLabelsTypeToHermesFormTypeMap: Partial<
  Record<FormLabelsType, FormType>
> = {
  login: FormType.Login,
  register: FormType.Register,
  identity: FormType.Identity,
  change_password: FormType.ChangePassword,
  payment: FormType.Payment,
  billing: FormType.Billing,
  shipping: FormType.Shipping,
  forgot_password: FormType.ForgotPassword,
  contact: FormType.Contact,
  newsletter: FormType.Newsletter,
  search: FormType.Search,
  shopping_basket: FormType.ShoppingBasket,
  other: FormType.Other,
};
export const dropdownWebcardWarningTypeToHermesWarningType: Partial<
  Record<AutofillDropdownWebcardWarningType, AutofillMessageType>
> = {
  [AutofillDropdownWebcardWarningType.PasswordGenerationDashlaneLogin]:
    AutofillMessageType.LoginAccountPasswordGeneration,
  [AutofillDropdownWebcardWarningType.PossibleDuplicateRegistration]:
    AutofillMessageType.DuplicateRisk,
  [AutofillDropdownWebcardWarningType.UnsecureProtocol]:
    AutofillMessageType.HttpUnsecureWebsite,
  [AutofillDropdownWebcardWarningType.UnsecureIframe]:
    AutofillMessageType.UnsecureIframe,
  [AutofillDropdownWebcardWarningType.SandboxedIframe]:
    AutofillMessageType.UnsecureIframeSandbox,
  [AutofillDropdownWebcardWarningType.PasswordLimitReached]:
    AutofillMessageType.FreeAccountPasswordLimitReached,
  [AutofillDropdownWebcardWarningType.None]:
    AutofillMessageType.HttpUnsecureWebsite,
};
export const authenticatorAttachmentStringToHermesAuthenticatorAttachmentType: Record<
  AuthenticatorAttachment,
  hermesAuthenticatorAttachment
> = {
  "cross-platform": hermesAuthenticatorAttachment.CrossPlatform,
  platform: hermesAuthenticatorAttachment.Platform,
};
export const authenticatorResidentKeyRequirementToAuthenticatorResidentKeyHermesType: Record<
  ResidentKeyRequirement,
  hermesAuthenticatorResidentKey
> = {
  discouraged: hermesAuthenticatorResidentKey.Discouraged,
  preferred: hermesAuthenticatorResidentKey.Preferred,
  required: hermesAuthenticatorResidentKey.Required,
};
export const authenticatorUserVerificationRequirementToHermesType: Record<
  UserVerificationRequirement,
  hermesAuthenticatorUserVerification
> = {
  discouraged: hermesAuthenticatorUserVerification.Discouraged,
  preferred: hermesAuthenticatorUserVerification.Preferred,
  required: hermesAuthenticatorUserVerification.Required,
};
export const webAuthnErrorNameToHermesPasskeyRegistrationErrorType: Record<
  WebauthnErrorName,
  PasskeyRegistrationErrorType
> = {
  [WebauthnErrorName.InvalidStateError]:
    PasskeyRegistrationErrorType.InvalidState,
  [WebauthnErrorName.NotAllowedError]: PasskeyRegistrationErrorType.NotAllowed,
  [WebauthnErrorName.NotSupportedError]:
    PasskeyRegistrationErrorType.NotSupported,
  [WebauthnErrorName.SecurityError]: PasskeyRegistrationErrorType.Security,
  [WebauthnErrorName.UnknownError]: PasskeyRegistrationErrorType.Unknown,
};
export const webAuthnErrorNameToHermesPasskeyAuthenticationErrorType: Record<
  WebauthnErrorName,
  PasskeyAuthenticationErrorType
> = {
  [WebauthnErrorName.InvalidStateError]:
    PasskeyAuthenticationErrorType.InvalidState,
  [WebauthnErrorName.NotAllowedError]:
    PasskeyAuthenticationErrorType.NotAllowed,
  [WebauthnErrorName.NotSupportedError]:
    PasskeyAuthenticationErrorType.NotSupported,
  [WebauthnErrorName.SecurityError]: PasskeyAuthenticationErrorType.Security,
  [WebauthnErrorName.UnknownError]: PasskeyAuthenticationErrorType.Unknown,
};
export const credentialMediationRequirementToHermesAuthenticationMediationType: Record<
  CredentialMediationRequirement,
  AuthenticationMediationType
> = {
  conditional: AuthenticationMediationType.Conditional,
  optional: AuthenticationMediationType.Optional,
  required: AuthenticationMediationType.Required,
  silent: AuthenticationMediationType.Silent,
};
export const numberToCorrespondingAlgorithmName: Record<
  number,
  AlgorithmsSupported
> = {
  1: AlgorithmsSupported.A128Gcm,
  [-3]: AlgorithmsSupported.A128Kw,
  2: AlgorithmsSupported.A192Gcm,
  [-4]: AlgorithmsSupported.A192Kw,
  3: AlgorithmsSupported.A256Gcm,
  [-5]: AlgorithmsSupported.A256Kw,
  30: AlgorithmsSupported.AesCcm16128128,
  31: AlgorithmsSupported.AesCcm16128256,
  10: AlgorithmsSupported.AesCcm1664128,
  11: AlgorithmsSupported.AesCcm1664256,
  32: AlgorithmsSupported.AesCcm64128128,
  33: AlgorithmsSupported.AesCcm64128256,
  12: AlgorithmsSupported.AesCcm6464128,
  13: AlgorithmsSupported.AesCcm6464256,
  14: AlgorithmsSupported.AesMac128128,
  15: AlgorithmsSupported.AesMac12864,
  25: AlgorithmsSupported.AesMac256128,
  26: AlgorithmsSupported.AesMac25664,
  24: AlgorithmsSupported.ChaCha20Poly1305,
  [-6]: AlgorithmsSupported.Direct,
  [-12]: AlgorithmsSupported.DirectHkdfAes128,
  [-13]: AlgorithmsSupported.DirectHkdfAes256,
  [-10]: AlgorithmsSupported.DirectHkdfSha256,
  [-11]: AlgorithmsSupported.DirectHkdfSha512,
  [-32]: AlgorithmsSupported.EcdhEsA128Kw,
  [-30]: AlgorithmsSupported.EcdhEsA192Kw,
  [-34]: AlgorithmsSupported.EcdhEsA256Kw,
  [-31]: AlgorithmsSupported.EcdhEsHkdf256,
  [-26]: AlgorithmsSupported.EcdhEsHkdf512,
  [-29]: AlgorithmsSupported.EcdhSsA128Kw,
  [-33]: AlgorithmsSupported.EcdhSsA192Kw,
  [-25]: AlgorithmsSupported.EcdhSsA256Kw,
  [-27]: AlgorithmsSupported.EcdhSsHkdf256,
  [-28]: AlgorithmsSupported.EcdhSsHkdf512,
  [-8]: AlgorithmsSupported.EdDsa,
  [-7]: AlgorithmsSupported.Es256,
  [-47]: AlgorithmsSupported.Es256K,
  [-35]: AlgorithmsSupported.Es384,
  [-36]: AlgorithmsSupported.Es512,
  5: AlgorithmsSupported.Hmac256256,
  4: AlgorithmsSupported.Hmac25664,
  6: AlgorithmsSupported.Hmac384384,
  7: AlgorithmsSupported.Hmac512512,
  [-46]: AlgorithmsSupported.HssLms,
  34: AlgorithmsSupported.IvGeneration,
  [-37]: AlgorithmsSupported.Ps256,
  [-38]: AlgorithmsSupported.Ps384,
  [-39]: AlgorithmsSupported.Ps512,
  0: AlgorithmsSupported.Reserved,
  [-65535]: AlgorithmsSupported.Rs1,
  [-257]: AlgorithmsSupported.Rs256,
  [-258]: AlgorithmsSupported.Rs384,
  [-259]: AlgorithmsSupported.Rs512,
  [-40]: AlgorithmsSupported.RsaesOaepWithRfc8017,
  [-41]: AlgorithmsSupported.RsaesOaepWithSha256,
  [-42]: AlgorithmsSupported.RsaesOaepWithSha512,
  [-14]: AlgorithmsSupported.Sha1,
  [-16]: AlgorithmsSupported.Sha256,
  [-15]: AlgorithmsSupported.Sha25664,
  [-43]: AlgorithmsSupported.Sha384,
  [-44]: AlgorithmsSupported.Sha512,
  [-17]: AlgorithmsSupported.Sha512256,
  [-18]: AlgorithmsSupported.Shake128,
  [-45]: AlgorithmsSupported.Shake256,
  8: AlgorithmsSupported.Unassigned,
  [-260]: AlgorithmsSupported.WalnutDsa,
};
