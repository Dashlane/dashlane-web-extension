import { Identity } from "@dashlane/communication";
import { IdentityMappers } from "DataManagement/PersonalInfo/Identity/types";
import { lastUseMapper } from "DataManagement/PersonalData/mappers";
export const getIdentityMappers = (): IdentityMappers => ({
  spaceId: (i: Identity) => i.SpaceId,
  lastUse: lastUseMapper,
  id: (i: Identity) => i.Id,
});
