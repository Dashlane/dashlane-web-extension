import { PersonalWebsite } from "@dashlane/communication";
import { PersonalWebsiteMappers } from "DataManagement/PersonalInfo/PersonalWebsite/types";
import { lastUseMapper } from "DataManagement/PersonalData/mappers";
export const getPersonalWebsiteMappers = (): PersonalWebsiteMappers => ({
  spaceId: (p: PersonalWebsite) => p.SpaceId,
  lastUse: lastUseMapper,
  id: (p: PersonalWebsite) => p.Id,
});
