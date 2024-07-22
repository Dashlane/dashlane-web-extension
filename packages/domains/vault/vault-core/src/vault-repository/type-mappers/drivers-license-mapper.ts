import {
  DriverLicense as CarbonDriversLicense,
  Identity,
} from "@dashlane/communication";
import { DriversLicense } from "@dashlane/vault-contracts";
import { formatDate, mapKeysToLowercase } from "../utility";
import { identityToName } from "./identity-to-name-mapper";
export const driversLicenseMapper = (
  carbonDriversLicense: CarbonDriversLicense,
  identity?: Identity
): DriversLicense => {
  const {
    DeliveryDate,
    ExpireDate,
    Fullname,
    Number,
    DateOfBirth,
    Sex,
    ...rest
  } = carbonDriversLicense;
  return {
    ...mapKeysToLowercase(rest),
    idName: identityToName(identity) || Fullname || "",
    idNumber: Number,
    issueDate: formatDate(DeliveryDate),
    expirationDate: formatDate(ExpireDate),
    country: rest.LocaleFormat,
  };
};
