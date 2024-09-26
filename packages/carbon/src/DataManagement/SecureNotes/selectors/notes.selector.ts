import { createSelector } from "reselect";
import { Note } from "@dashlane/communication";
import { State } from "Store";
import { filterOutQuarantinedItems } from "DataManagement/quarantined-filter";
import { quarantinedSpacesSelector } from "DataManagement/SmartTeamSpaces/forced-categorization.selectors";
const allUnsafeNotesSelector = (state: State): Note[] =>
  state.userSession.personalData.notes;
export const notesSelector = createSelector(
  allUnsafeNotesSelector,
  quarantinedSpacesSelector,
  filterOutQuarantinedItems
);
