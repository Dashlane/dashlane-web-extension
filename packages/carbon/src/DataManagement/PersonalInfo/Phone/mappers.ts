import { Phone } from "@dashlane/communication";
import { PhoneMappers } from "DataManagement/PersonalInfo/Phone/types";
import { lastUseMapper } from "DataManagement/PersonalData/mappers";
export const getPhoneMappers = (): PhoneMappers => ({
  spaceId: (p: Phone) => p.SpaceId,
  lastUse: lastUseMapper,
  id: (p: Phone) => p.Id,
});
