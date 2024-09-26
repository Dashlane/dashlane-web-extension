import { State } from "Store";
import { Identity } from "@dashlane/communication";
import { identityMatch } from "DataManagement/PersonalInfo/Identity/search";
import { getQuerySelector } from "DataManagement/query-selector";
import { findDataModelObject } from "DataManagement/PersonalData/utils";
import { createSelector } from "reselect";
import { getIdentityMappers } from "DataManagement/PersonalInfo/Identity/mappers";
import { filterOutQuarantinedItems } from "DataManagement/quarantined-filter";
import { quarantinedSpacesSelector } from "DataManagement/SmartTeamSpaces/forced-categorization.selectors";
const allUnsafeIdentitiesSelector = (state: State): Identity[] =>
  state.userSession.personalData.identities;
export const identitiesSelector = createSelector(
  allUnsafeIdentitiesSelector,
  quarantinedSpacesSelector,
  filterOutQuarantinedItems
);
export const identitiesByIdSelector = createSelector(
  identitiesSelector,
  (identities: Identity[]) =>
    identities.reduce((acc, identity: Identity) => {
      acc[identity.Id] = identity;
      return acc;
    }, {})
);
export const identitySelector = (
  state: State,
  identityId: string
): Identity => {
  const identities = identitiesSelector(state);
  return findDataModelObject(identityId, identities);
};
export const identityMappersSelector = (_state: State) => getIdentityMappers();
const identityMatchSelector = () => identityMatch;
export const queryIdentitiesSelector = getQuerySelector(
  identitiesSelector,
  identityMatchSelector,
  identityMappersSelector
);
