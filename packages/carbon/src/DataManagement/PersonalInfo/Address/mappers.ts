import { Address } from "@dashlane/communication";
import { AddressMappers } from "DataManagement/PersonalInfo/Address/types";
import { lastUseMapper } from "DataManagement/PersonalData/mappers";
export const getAddressMappers = (): AddressMappers => ({
  spaceId: (a: Address) => a.SpaceId,
  lastUse: lastUseMapper,
  id: (a: Address) => a.Id,
});
