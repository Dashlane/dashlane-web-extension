import { Company as CarbonCompany } from "@dashlane/communication";
import { Company } from "@dashlane/vault-contracts";
import { mapKeysToLowercase } from "../utility";
export const companyMapper = (carbonCompany: CarbonCompany): Company => {
  const { Name, PersonalNote, LocaleFormat, ...rest } = carbonCompany;
  return {
    ...mapKeysToLowercase(rest),
    companyName: Name,
  };
};
