import {
  DriverLicense,
  DriverLicenseWithIdentity,
  Match,
} from "@dashlane/communication";
import { match } from "DataManagement/Search/match";
import { stringProp } from "DataManagement/Search/utils";
import { identityToName } from "DataManagement/Ids/helpers";
export const searchGetters: ((b: DriverLicense) => string)[] = [
  stringProp<DriverLicense>("Number"),
  (idCard: DriverLicenseWithIdentity) =>
    identityToName(idCard.identity) || idCard.Fullname,
];
export type DriverLicenseMatch = Match<DriverLicense>;
export const driverLicenseMatch: DriverLicenseMatch = match(searchGetters);
