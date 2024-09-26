import { Passport, PassportWithIdentity } from "@dashlane/communication";
import { PassportMappers } from "DataManagement/Ids/Passports/types";
import { lastUseMapper } from "DataManagement/PersonalData/mappers";
import { identityToName } from "DataManagement/Ids/helpers";
export const getPassportMappers = (): PassportMappers => ({
  spaceId: (p: Passport) => p.SpaceId,
  name: (p: PassportWithIdentity) => identityToName(p.identity) || p.Fullname,
  idNumber: (p: Passport) => p.Number,
  lastUse: lastUseMapper,
  id: (p: Passport) => p.Id,
  creationDate: (p: Passport) => p.CreationDatetime,
});
