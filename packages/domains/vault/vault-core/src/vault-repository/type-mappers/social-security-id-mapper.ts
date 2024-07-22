import {
  SocialSecurityId as CarbonSocialSecurityId,
  Identity,
} from "@dashlane/communication";
import { SocialSecurityId } from "@dashlane/vault-contracts";
import { mapKeysToLowercase } from "../utility";
import { identityToName } from "./identity-to-name-mapper";
export const socialSecurityIdMapper = (
  carbonSocialSecurityId: CarbonSocialSecurityId,
  identity?: Identity
): SocialSecurityId => {
  const {
    DateOfBirth,
    LinkedIdentity,
    Sex,
    SocialSecurityFullname,
    SocialSecurityNumber,
    ...rest
  } = carbonSocialSecurityId;
  return {
    ...mapKeysToLowercase(rest),
    idName: identityToName(identity) || SocialSecurityFullname || "",
    idNumber: SocialSecurityNumber,
    country: rest.LocaleFormat,
  };
};
