import { Country, VaultItemType } from "@dashlane/vault-contracts";
import { TranslatorInterface } from "../../../../libs/i18n/types";
import { getFallbackIdTitle } from "../../../ids/helpers";
import { IdItem, IdVaultItemType } from "../../../ids/types";
const getData = (
  mapper: Record<IdVaultItemType, string>,
  type: IdVaultItemType,
  item: IdItem,
  translate: TranslatorInterface
) => {
  const field = mapper[type];
  const fieldValue = item[field];
  if (field === "country") {
    return fieldValue === undefined || fieldValue === Country.UNIVERSAL
      ? ""
      : translate(`country_name_${fieldValue}`);
  } else if (field === "name" && !fieldValue) {
    return getFallbackIdTitle(type, item.country, translate);
  }
  return fieldValue;
};
type ItemThumbnail =
  | "drivers-license"
  | "tax-number"
  | "id-card"
  | "passport"
  | "social-security-number";
const thumbnailsDataMapper: Record<IdVaultItemType, ItemThumbnail> = {
  [VaultItemType.DriversLicense]: "drivers-license",
  [VaultItemType.FiscalId]: "tax-number",
  [VaultItemType.IdCard]: "id-card",
  [VaultItemType.Passport]: "passport",
  [VaultItemType.SocialSecurityId]: "social-security-number",
};
const titleDataMapper: Record<IdVaultItemType, string> = {
  [VaultItemType.DriversLicense]: "idName",
  [VaultItemType.FiscalId]: "fiscalNumber",
  [VaultItemType.IdCard]: "idName",
  [VaultItemType.Passport]: "idName",
  [VaultItemType.SocialSecurityId]: "idName",
};
const descriptionDataMapper: Record<IdVaultItemType, string> = {
  [VaultItemType.DriversLicense]: "idNumber",
  [VaultItemType.FiscalId]: "country",
  [VaultItemType.IdCard]: "idNumber",
  [VaultItemType.Passport]: "idNumber",
  [VaultItemType.SocialSecurityId]: "idNumber",
};
export const getIdDocumentData = (
  type: IdVaultItemType,
  item: IdItem,
  translate: TranslatorInterface
) => ({
  thumbnail: thumbnailsDataMapper[type],
  title: getData(titleDataMapper, type, item, translate),
  description: getData(descriptionDataMapper, type, item, translate),
});
