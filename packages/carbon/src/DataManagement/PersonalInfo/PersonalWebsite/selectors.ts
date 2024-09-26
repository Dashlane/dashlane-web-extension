import { createSelector } from "reselect";
import { PersonalWebsite } from "@dashlane/communication";
import { State } from "Store";
import { personalWebsiteMatch } from "DataManagement/PersonalInfo/PersonalWebsite/search";
import { getQuerySelector } from "DataManagement/query-selector";
import { findDataModelObject } from "DataManagement/PersonalData/utils";
import { getPersonalWebsiteMappers } from "DataManagement/PersonalInfo/PersonalWebsite/mappers";
import { filterOutQuarantinedItems } from "DataManagement/quarantined-filter";
import { quarantinedSpacesSelector } from "DataManagement/SmartTeamSpaces/forced-categorization.selectors";
const allUnsafePersonalWebsitesSelector = (state: State): PersonalWebsite[] =>
  state.userSession.personalData.personalWebsites;
export const personalWebsitesSelector = createSelector(
  allUnsafePersonalWebsitesSelector,
  quarantinedSpacesSelector,
  filterOutQuarantinedItems
);
export const personalWebsiteSelector = (
  state: State,
  personalWebsiteId: string
): PersonalWebsite => {
  const personalWebsites = personalWebsitesSelector(state);
  return findDataModelObject(personalWebsiteId, personalWebsites);
};
export const personalWebsiteMappersSelector = (_state: State) =>
  getPersonalWebsiteMappers();
const personalWebsiteMatchSelector = () => personalWebsiteMatch;
export const queryPersonalWebsitesSelector = getQuerySelector(
  personalWebsitesSelector,
  personalWebsiteMatchSelector,
  personalWebsiteMappersSelector
);
