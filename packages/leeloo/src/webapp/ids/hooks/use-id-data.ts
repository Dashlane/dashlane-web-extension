import { DataStatus, useModuleQuery } from "@dashlane/framework-react";
import {
  DriversLicense,
  FiscalId,
  IdCard,
  Passport,
  SocialSecurityId,
  vaultItemsCrudApi,
  VaultItemType,
} from "@dashlane/vault-contracts";
import { IdVaultItemType } from "../types";
const IdItemTypeToResultDictionary: Record<IdVaultItemType, string> = {
  [VaultItemType.DriversLicense]: "driversLicensesResult",
  [VaultItemType.FiscalId]: "fiscalIdsResult",
  [VaultItemType.IdCard]: "idCardsResult",
  [VaultItemType.Passport]: "passportsResult",
  [VaultItemType.SocialSecurityId]: "socialSecurityIdsResult",
};
type Result = {
  status: DataStatus;
  item?: DriversLicense | FiscalId | IdCard | Passport | SocialSecurityId;
};
export function useIdData(itemType: IdVaultItemType, id: string): Result {
  const { status, data } = useModuleQuery(vaultItemsCrudApi, "query", {
    vaultItemTypes: [itemType],
    ids: [id],
  });
  return {
    status,
    item: data?.[IdItemTypeToResultDictionary[itemType]].items[0],
  };
}
