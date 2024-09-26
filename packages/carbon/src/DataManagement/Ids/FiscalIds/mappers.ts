import { FiscalId } from "@dashlane/communication";
import { FiscalIdMappers } from "DataManagement/Ids/FiscalIds/types";
import { lastUseMapper } from "DataManagement/PersonalData/mappers";
export const getFiscalIdMappers = (): FiscalIdMappers => ({
  spaceId: (p: FiscalId) => p.SpaceId,
  idNumber: (p: FiscalId) => p.FiscalNumber,
  teledeclarantNumber: (p: FiscalId) => p.TeledeclarantNumber,
  lastUse: lastUseMapper,
  id: (p: FiscalId) => p.Id,
  creationDate: (p: FiscalId) => p.CreationDatetime,
});
