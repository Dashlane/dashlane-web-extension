import { Company } from "@dashlane/communication";
import { CompanyMappers } from "DataManagement/PersonalInfo/Company/types";
import { lastUseMapper } from "DataManagement/PersonalData/mappers";
export const getCompanyMappers = (): CompanyMappers => ({
  spaceId: (c: Company) => c.SpaceId,
  lastUse: lastUseMapper,
  id: (c: Company) => c.Id,
});
