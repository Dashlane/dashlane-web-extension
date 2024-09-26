import {
  CredentialItemView,
  CredentialsByDomainDataQuery,
  ListResults,
} from "@dashlane/communication";
import { State } from "Store";
import { getQueryByDomainSelector } from "DataManagement/Credentials/selectors/query-by-domain.selector";
import { listViewSelector } from "DataManagement/Credentials/selectors/list-view.selector";
import { viewListResults } from "DataManagement/Search/views";
export const viewedQueriedCredentialsByDomainSelector = (
  state: State,
  dataQuery: CredentialsByDomainDataQuery
): ListResults<CredentialItemView> => {
  const { domain, ...query } = dataQuery;
  const queryByDomainSelector = getQueryByDomainSelector(domain);
  const queryResults = queryByDomainSelector(state, query);
  const listView = listViewSelector(state);
  return viewListResults(listView)(queryResults);
};
