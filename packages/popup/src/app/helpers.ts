import { NodePremiumStatus, PremiumStatus } from "@dashlane/communication";
import { Field, ItemType } from "@dashlane/hermes";
import { VaultItemType } from "@dashlane/vault-contracts";
import type { VaultIngredient } from "@dashlane/autofill-engine/types";
import { webappOpen } from "@dashlane/framework-infra/spi";
import { VaultSourceType } from "@dashlane/autofill-contracts";
import { kernel } from "../kernel";
export const isAccountBusiness = (premiumStatus: PremiumStatus): boolean => {
  return (
    Array.isArray(premiumStatus.spaces) &&
    premiumStatus.spaces.some((space) => space.status !== "revoked")
  );
};
export const isAccountBusinessAdmin = (
  premiumStatus: PremiumStatus | null | undefined
): boolean => {
  if (!premiumStatus) {
    return false;
  }
  return (
    isAccountBusiness(premiumStatus) &&
    (premiumStatus.spaces ?? []).some(
      (space) => space.isTeamAdmin || space.isBillingAdmin
    )
  );
};
export const isBusinessAccount = (
  premiumStatus: NodePremiumStatus
): boolean => {
  return (premiumStatus.spaces ?? []).some(
    (space) => space.tier === "business"
  );
};
export const isTeamTrial = (
  premiumStatus: PremiumStatus | null | undefined
): boolean => {
  if (!premiumStatus) {
    return false;
  }
  return (
    isAccountBusiness(premiumStatus) &&
    (premiumStatus.spaces ?? []).some((space) => space.planType === "teamTrial")
  );
};
export const isB2BAccount = (premiumStatus: NodePremiumStatus): boolean => {
  return (
    Array.isArray(premiumStatus.spaces) &&
    premiumStatus.spaces.some((space) => space.status !== "revoked")
  );
};
export const openWebAppAndClosePopup = async ({
  id,
  query,
  route,
}: Parameters<typeof webappOpen>[0]): Promise<void> => {
  await webappOpen({
    id,
    query,
    route,
  });
  kernel.browser.closePopover();
};
export const vaultItemTypeTypeToVaultSourceTypeMap: Partial<
  Record<VaultItemType, VaultSourceType>
> = {
  [VaultItemType.Address]: VaultSourceType.Address,
  [VaultItemType.BankAccount]: VaultSourceType.BankAccount,
  [VaultItemType.Company]: VaultSourceType.Company,
  [VaultItemType.Credential]: VaultSourceType.Credential,
  [VaultItemType.DriversLicense]: VaultSourceType.DriverLicense,
  [VaultItemType.Email]: VaultSourceType.Email,
  [VaultItemType.FiscalId]: VaultSourceType.FiscalId,
  [VaultItemType.IdCard]: VaultSourceType.IdCard,
  [VaultItemType.Identity]: VaultSourceType.Identity,
  [VaultItemType.Passport]: VaultSourceType.Passport,
  [VaultItemType.PaymentCard]: VaultSourceType.PaymentCard,
  [VaultItemType.Website]: VaultSourceType.PersonalWebsite,
  [VaultItemType.Phone]: VaultSourceType.Phone,
  [VaultItemType.SocialSecurityId]: VaultSourceType.SocialSecurityId,
};
export const vaultItemTypeToHermesItemTypeMap: Partial<
  Record<VaultItemType, ItemType>
> = {
  [VaultItemType.Address]: ItemType.Address,
  [VaultItemType.BankAccount]: ItemType.BankStatement,
  [VaultItemType.Company]: ItemType.Company,
  [VaultItemType.Credential]: ItemType.Credential,
  [VaultItemType.DriversLicense]: ItemType.DriverLicence,
  [VaultItemType.Email]: ItemType.Email,
  [VaultItemType.FiscalId]: ItemType.FiscalStatement,
  [VaultItemType.IdCard]: ItemType.IdCard,
  [VaultItemType.Identity]: ItemType.Identity,
  [VaultItemType.Passport]: ItemType.Passport,
  [VaultItemType.PaymentCard]: ItemType.CreditCard,
  [VaultItemType.Website]: ItemType.Website,
  [VaultItemType.Phone]: ItemType.Phone,
  [VaultItemType.SocialSecurityId]: ItemType.SocialSecurity,
};
export const hermesFieldToVaultIngredient: Partial<
  Record<Field, VaultIngredient["property"]>
> = {
  [Field.Email]: "email",
  [Field.Login]: "login",
  [Field.SecondaryLogin]: "secondaryLogin",
  [Field.Password]: "password",
  [Field.OtpCode]: "otpSecret",
  [Field.Iban]: "IBAN",
  [Field.Bic]: "BIC",
  [Field.Bank]: "bank",
  [Field.Country]: "country",
  [Field.Name]: "name",
  [Field.CardNumber]: "cardNumber",
  [Field.OwnerName]: "ownerName",
  [Field.SecurityCode]: "securityCode",
  [Field.ExpireDate]: "expireDate",
};
export const getTabNumbers = (
  isBusinessAdmin: boolean
): Record<string, number> => {
  if (isBusinessAdmin) {
    return {
      VAULT: 0,
      ADMIN: 1,
      AUTOFILL: 2,
      GENERATOR: 3,
      MORE_TOOLS: 4,
    };
  }
  return {
    VAULT: 0,
    AUTOFILL: 1,
    GENERATOR: 2,
    MORE_TOOLS: 3,
  };
};
