import { Identity as CarbonIdentity } from "@dashlane/communication";
import { Identity, IdentityTitle } from "@dashlane/vault-contracts";
import { mapKeysToLowercase } from "../utility";
const IdentityTitleTypeDictionary = {
  "": undefined,
  MR: IdentityTitle.Mr,
  MME: IdentityTitle.Mrs,
  MLLE: IdentityTitle.Miss,
  MS: IdentityTitle.Ms,
  MX: IdentityTitle.Mx,
  NONE_OF_THESE: IdentityTitle.NoneOfThese,
};
export const identityMapper = (carbonIdentity: CarbonIdentity): Identity => {
  const { Title, LocaleFormat, ...rest } = carbonIdentity;
  return {
    ...mapKeysToLowercase(rest),
    title: IdentityTitleTypeDictionary[Title],
  };
};
