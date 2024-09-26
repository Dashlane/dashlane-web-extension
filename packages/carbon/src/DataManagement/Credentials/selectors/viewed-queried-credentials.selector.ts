import {
  CredentialFilterField,
  CredentialItemView,
  CredentialSortField,
  DataQuery,
  ListResults,
} from "@dashlane/communication";
import { State } from "Store";
import { viewListResults } from "DataManagement/Search/views";
import { querySelector } from "DataManagement/Credentials/selectors/query.selector";
import { listViewSelector } from "DataManagement/Credentials/selectors/list-view.selector";
export const viewedQueriedCredentialsSelector = (
  state: State,
  query: DataQuery<CredentialSortField, CredentialFilterField>
): ListResults<CredentialItemView> => {
  const queryResults = querySelector(state, query);
  const listView = listViewSelector(state);
  return viewListResults(listView)(queryResults);
};
