import { WebappRoute } from "@dashlane/autofill-engine/dist/autofill-engine/src/spi";
import { VaultSourceType } from "@dashlane/autofill-contracts";
export const vaultSourceTypeToWebappRouteNameMap: Partial<
  Record<VaultSourceType, WebappRoute>
> = {
  [VaultSourceType.Address]: "/addresses",
  [VaultSourceType.Credential]: "/passwords",
  [VaultSourceType.BankAccount]: "/bank-accounts",
  [VaultSourceType.Company]: "/companies",
  [VaultSourceType.DriverLicense]: "/driver-licenses",
  [VaultSourceType.Email]: "/emails",
  [VaultSourceType.FiscalId]: "/fiscals",
  [VaultSourceType.IdCard]: "/id-cards",
  [VaultSourceType.Identity]: "/identities",
  [VaultSourceType.Passport]: "/passports",
  [VaultSourceType.PaymentCard]: "/credit-cards",
  [VaultSourceType.Phone]: "/phones",
  [VaultSourceType.SocialSecurityId]: "/social-security-numbers",
  [VaultSourceType.PersonalWebsite]: "/websites",
};
