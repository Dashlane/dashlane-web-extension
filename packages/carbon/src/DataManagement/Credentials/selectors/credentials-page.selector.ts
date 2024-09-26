import { CredentialItemView, Page } from "@dashlane/communication";
import { State } from "Store";
import {
  generateNextToken,
  generatePrevToken,
  getBatch,
} from "Libs/Pagination";
import { parseToken, stringifyToken } from "Libs/Query";
import { fieldMappersSelector } from "DataManagement/Credentials/selectors/field-mappers.selector";
import { credentialsQuerySelector } from "DataManagement/Credentials/selectors/credentials-query.selector";
import { listViewSelector } from "DataManagement/Credentials/selectors/list-view.selector";
export const credentialsPageSelector = (
  state: State,
  tokenString: string
): Page<CredentialItemView> => {
  const token = parseToken(tokenString);
  const { sortToken, filterToken } = token;
  const tokens = { sortToken, filterToken };
  const mappers = fieldMappersSelector(state);
  const credentials = credentialsQuerySelector(state, tokens);
  const listView = listViewSelector(state);
  const nextToken = generateNextToken(mappers, token, credentials);
  const prevToken = generatePrevToken(mappers, token, credentials);
  const batch = getBatch(mappers, token, credentials);
  const nextTokenString = stringifyToken(nextToken);
  const prevTokenString = stringifyToken(prevToken);
  const viewedBatch = listView(batch);
  return {
    batch: viewedBatch,
    nextToken: nextTokenString,
    prevToken: prevTokenString,
  };
};
