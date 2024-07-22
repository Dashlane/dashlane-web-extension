import { FiscalId as CarbonFiscalId } from "@dashlane/communication";
import { FiscalId } from "@dashlane/vault-contracts";
import { mapKeysToLowercase } from "../utility";
export const fiscalIdMapper = (carbonFiscalId: CarbonFiscalId): FiscalId => {
  return {
    ...mapKeysToLowercase(carbonFiscalId),
    country: carbonFiscalId.LocaleFormat,
  };
};
