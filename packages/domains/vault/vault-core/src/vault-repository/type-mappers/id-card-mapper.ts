import { IdCard as CarbonIdCard, Identity } from "@dashlane/communication";
import { IdCard } from "@dashlane/vault-contracts";
import { formatDate, mapKeysToLowercase } from "../utility";
import { identityToName } from "./identity-to-name-mapper";
export const idCardMapper = (
  carbonIdCard: CarbonIdCard,
  identity?: Identity
): IdCard => {
  const {
    DateOfBirth,
    DeliveryDate,
    ExpireDate,
    Fullname,
    Number,
    Sex,
    ...rest
  } = carbonIdCard;
  return {
    ...mapKeysToLowercase(rest),
    idName: identityToName(identity) || Fullname || "",
    idNumber: Number,
    issueDate: formatDate(DeliveryDate),
    expirationDate: formatDate(ExpireDate),
    country: rest.LocaleFormat,
  };
};
