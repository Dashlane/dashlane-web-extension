import {
  SocialSecurityId,
  SocialSecurityIdWithIdentity,
} from "@dashlane/communication";
import { SocialSecurityIdMappers } from "DataManagement/Ids/SocialSecurityIds/types";
import { lastUseMapper } from "DataManagement/PersonalData/mappers";
import { identityToName } from "DataManagement/Ids/helpers";
export const getSocialSecurityIdMappers = (): SocialSecurityIdMappers => ({
  spaceId: (p: SocialSecurityId) => p.SpaceId,
  name: (p: SocialSecurityIdWithIdentity) =>
    identityToName(p.identity) || p.SocialSecurityFullname,
  idNumber: (p: SocialSecurityId) => p.SocialSecurityNumber,
  lastUse: lastUseMapper,
  id: (p: SocialSecurityId) => p.Id,
  creationDate: (p: SocialSecurityId) => p.CreationDatetime,
});
