import { createSelector } from "reselect";
import { State } from "Store";
import { filterOutQuarantinedItems } from "DataManagement/quarantined-filter";
import { quarantinedSpacesSelector } from "DataManagement/SmartTeamSpaces/forced-categorization.selectors";
import { ChangeHistory } from "DataManagement/ChangeHistory";
import { TransactionType } from "Libs/Backup/Transactions/types";
const credentialsFilter = (value: ChangeHistory) =>
  value.ObjectType === TransactionType.AUTHENTIFIANT;
const unsafeAllCredentialHistoriesSelector = createSelector(
  (state: State) => state.userSession.personalData.changeHistories,
  (credentialChangeHistories) =>
    credentialChangeHistories.filter(credentialsFilter)
);
export const credentialsHistoriesSelector = createSelector(
  [unsafeAllCredentialHistoriesSelector, quarantinedSpacesSelector],
  filterOutQuarantinedItems
);
