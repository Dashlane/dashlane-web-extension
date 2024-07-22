import { Secret as CarbonSecret } from "@dashlane/communication";
import { Secret } from "@dashlane/vault-contracts";
import { mapKeysToLowercase } from "../utility";
export const secretMapper = (carbonSecret: CarbonSecret): Secret => {
  const { LocaleFormat, Secured, ...rest } = carbonSecret;
  return {
    ...mapKeysToLowercase(rest),
    isSecured: Secured,
  };
};
