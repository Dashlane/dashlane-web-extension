import { Passkey } from "@dashlane/communication";
import { PasskeyMappers } from "DataManagement/Passkeys/types";
import { lastUseMapper } from "DataManagement/PersonalData/mappers";
export const getPasskeyMappers = (): PasskeyMappers => ({
  id: (p: Passkey) => p.Id,
  itemName: (p: Passkey) => p.ItemName,
  lastUse: lastUseMapper,
  rpId: (p: Passkey) => p.RpId,
  spaceId: (p: Passkey) => p.SpaceId,
  userDisplayName: (p: Passkey) => p.UserDisplayName,
});
