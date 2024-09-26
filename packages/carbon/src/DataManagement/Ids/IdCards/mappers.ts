import { IdCard, IdCardWithIdentity } from "@dashlane/communication";
import { IdCardMappers } from "DataManagement/Ids/IdCards/types";
import { lastUseMapper } from "DataManagement/PersonalData/mappers";
import { identityToName } from "DataManagement/Ids/helpers";
export const getIdCardMappers = (): IdCardMappers => ({
  spaceId: (p: IdCard) => p.SpaceId,
  name: (p: IdCardWithIdentity) => identityToName(p.identity) || p.Fullname,
  idNumber: (p: IdCard) => p.Number,
  lastUse: lastUseMapper,
  id: (p: IdCard) => p.Id,
  creationDate: (p: IdCard) => p.CreationDatetime,
});
