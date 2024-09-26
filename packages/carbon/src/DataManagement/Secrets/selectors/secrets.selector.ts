import { Secret } from "@dashlane/communication";
import { createSelector } from "reselect";
import { State } from "Store";
import { filterOutQuarantinedItems } from "DataManagement/quarantined-filter";
import { quarantinedSpacesSelector } from "DataManagement/SmartTeamSpaces/forced-categorization.selectors";
const allUnsafeSecretsSelector = (state: State): Secret[] =>
  state.userSession.personalData.secrets;
export const secretsSelector = createSelector(
  allUnsafeSecretsSelector,
  quarantinedSpacesSelector,
  filterOutQuarantinedItems
);
