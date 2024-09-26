import { Email } from "@dashlane/communication";
import { State } from "Store";
import { emailMatch } from "DataManagement/PersonalInfo/Email/search";
import { getEmailMappers } from "DataManagement/PersonalInfo/Email/mappers";
import { getQuerySelector } from "DataManagement/query-selector";
import { findDataModelObject } from "DataManagement/PersonalData/utils";
import { createSelector } from "reselect";
import { quarantinedSpacesSelector } from "DataManagement/SmartTeamSpaces/forced-categorization.selectors";
import { filterOutQuarantinedItems } from "DataManagement/quarantined-filter";
const unsafeAllEmailsSelector = (state: State): Email[] =>
  state.userSession.personalData.emails;
export const countAllEmailsSelector = (state: State): number =>
  state.userSession.personalData.emails.length;
export const emailsSelector = createSelector(
  unsafeAllEmailsSelector,
  quarantinedSpacesSelector,
  filterOutQuarantinedItems
);
export const emailSelector = (state: State, emailId: string): Email => {
  const emails = emailsSelector(state);
  return findDataModelObject(emailId, emails);
};
const emailMappersSelector = (_state: State) => getEmailMappers();
const emailMatchSelector = () => emailMatch;
export const queryEmailsSelector = getQuerySelector(
  emailsSelector,
  emailMatchSelector,
  emailMappersSelector
);
