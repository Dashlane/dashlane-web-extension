import { Passport as CarbonPassport, Identity } from "@dashlane/communication";
import { Passport } from "@dashlane/vault-contracts";
import { formatDate, mapKeysToLowercase } from "../utility";
import { identityToName } from "./identity-to-name-mapper";
export const passportMapper = (
  carbonPassport: CarbonPassport,
  identity?: Identity
): Passport => {
  const {
    DeliveryDate,
    DeliveryPlace,
    ExpireDate,
    Fullname,
    Number,
    DateOfBirth,
    Sex,
    ...rest
  } = carbonPassport;
  return {
    ...mapKeysToLowercase(rest),
    idName: identityToName(identity) || Fullname || "",
    idNumber: Number || "",
    issueDate: formatDate(DeliveryDate),
    issuePlace: DeliveryPlace || "",
    expirationDate: formatDate(ExpireDate),
    country: rest.LocaleFormat,
  };
};
