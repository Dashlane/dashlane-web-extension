import { Email } from "@dashlane/communication";
import { EmailMappers } from "DataManagement/PersonalInfo/Email/types";
import { lastUseMapper } from "DataManagement/PersonalData/mappers";
export const getEmailMappers = (): EmailMappers => ({
  spaceId: (e: Email) => e.SpaceId,
  lastUse: lastUseMapper,
  id: (e: Email) => e.Id,
});
