import {
  DriverLicense,
  DriverLicenseWithIdentity,
} from "@dashlane/communication";
import { DriverLicenseMappers } from "DataManagement/Ids/DriverLicenses/types";
import { lastUseMapper } from "DataManagement/PersonalData/mappers";
import { identityToName } from "DataManagement/Ids/helpers";
export const getDriverLicenseMappers = (): DriverLicenseMappers => ({
  spaceId: (p: DriverLicense) => p.SpaceId,
  name: (p: DriverLicenseWithIdentity) =>
    identityToName(p.identity) || p.Fullname,
  idNumber: (p: DriverLicense) => p.Number,
  lastUse: lastUseMapper,
  id: (p: DriverLicense) => p.Id,
  creationDate: (p: DriverLicense) => p.CreationDatetime,
});
