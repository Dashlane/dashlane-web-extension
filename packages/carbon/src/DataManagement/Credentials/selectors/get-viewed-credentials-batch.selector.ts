import {
  CredentialFilterField,
  CredentialSortField,
} from "@dashlane/communication";
import { createSelector } from "reselect";
import { credentialCategoriesSelector } from "DataManagement/Credentials/selectors/credential-categories.selector";
import { credentialsQuerySelector } from "DataManagement/Credentials/selectors/credentials-query.selector";
import { fieldMappersSelector } from "DataManagement/Credentials/selectors/field-mappers.selector";
import { iconsSelector } from "DataManagement/Icons/selectors";
import {
  getCredentialsBatch,
  viewCredentialsBatch,
} from "DataManagement/Credentials/pagination";
import { Token } from "Libs/Pagination/types";
import { optimizeBatchSelector } from "Libs/Query";
export const getViewedCredentialsBatchSelector = (
  token: Token<CredentialSortField, CredentialFilterField>
) => {
  const { sortToken, filterToken } = token;
  const tokens = { sortToken, filterToken };
  const getBatch = getCredentialsBatch(token);
  const batchSelector = createSelector(
    (state) => credentialsQuerySelector(state, tokens),
    fieldMappersSelector,
    getBatch
  );
  const optimizedBatchSelector = optimizeBatchSelector(batchSelector);
  return createSelector(
    optimizedBatchSelector,
    credentialCategoriesSelector,
    iconsSelector,
    viewCredentialsBatch
  );
};
