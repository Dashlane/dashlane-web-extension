import { createSelector } from "reselect";
import {
  Identity,
  SocialSecurityId,
  SocialSecurityIdWithIdentity,
} from "@dashlane/communication";
import { State } from "Store";
import { socialSecurityIdMatch } from "DataManagement/Ids/SocialSecurityIds/search";
import { getQuerySelector } from "DataManagement/query-selector";
import { findDataModelObject } from "DataManagement/PersonalData/utils";
import { getSocialSecurityIdMappers } from "DataManagement/Ids/SocialSecurityIds/mappers";
import { identitiesByIdSelector } from "DataManagement/PersonalInfo/Identity/selectors";
import { quarantinedSpacesSelector } from "DataManagement/SmartTeamSpaces/forced-categorization.selectors";
import { filterOutQuarantinedItems } from "DataManagement/quarantined-filter";
const allUnsafeSocialSecurityIdsSelector = (state: State): SocialSecurityId[] =>
  state.userSession.personalData.socialSecurityIds;
export const socialSecurityIdsSelector = createSelector(
  allUnsafeSocialSecurityIdsSelector,
  quarantinedSpacesSelector,
  filterOutQuarantinedItems
);
export const socialSecurityIdSelector = (
  state: State,
  socialSecurityIdId: string
): SocialSecurityId => {
  const socialSecurityIds = socialSecurityIdsSelector(state);
  return findDataModelObject(socialSecurityIdId, socialSecurityIds);
};
const socialSecurityIdsWithIdentitySelector: (
  state: State
) => SocialSecurityIdWithIdentity[] = createSelector(
  [socialSecurityIdsSelector, identitiesByIdSelector],
  (
    socialSecurityIds: SocialSecurityId[],
    identities: {
      string: Identity;
    }
  ) =>
    socialSecurityIds.map((socialSecurityId: SocialSecurityId) => ({
      ...socialSecurityId,
      identity: identities[socialSecurityId.LinkedIdentity],
    }))
);
export const socialSecurityIdWithIdentitySelector: (
  state: State,
  socialSecurityIdId: string
) => SocialSecurityIdWithIdentity = createSelector(
  [socialSecurityIdSelector, (state: State) => identitiesByIdSelector(state)],
  (
    socialSecurityId: SocialSecurityId,
    identities: {
      string: Identity;
    }
  ) => ({
    ...socialSecurityId,
    identity: identities[socialSecurityId.LinkedIdentity],
  })
);
const socialSecurityIdMappersSelector = (_state: State) =>
  getSocialSecurityIdMappers();
const socialSecurityIdMatchSelector = () => socialSecurityIdMatch;
export const querySocialSecurityIdsSelector = getQuerySelector(
  socialSecurityIdsWithIdentitySelector,
  socialSecurityIdMatchSelector,
  socialSecurityIdMappersSelector
);
