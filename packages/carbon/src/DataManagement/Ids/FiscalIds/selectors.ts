import { createSelector } from "reselect";
import { FiscalId } from "@dashlane/communication";
import { State } from "Store";
import { fiscalIdMatch } from "DataManagement/Ids/FiscalIds/search";
import { getQuerySelector } from "DataManagement/query-selector";
import { findDataModelObject } from "DataManagement/PersonalData/utils";
import { getFiscalIdMappers } from "DataManagement/Ids/FiscalIds/mappers";
import { filterOutQuarantinedItems } from "DataManagement/quarantined-filter";
import { quarantinedSpacesSelector } from "DataManagement/SmartTeamSpaces/forced-categorization.selectors";
const allUnsafeFiscalIdsSelector = (state: State): FiscalId[] =>
  state.userSession.personalData.fiscalIds;
export const fiscalIdsSelector = createSelector(
  allUnsafeFiscalIdsSelector,
  quarantinedSpacesSelector,
  filterOutQuarantinedItems
);
export const fiscalIdSelector = (
  state: State,
  fiscalIdId: string
): FiscalId => {
  const fiscalIds = fiscalIdsSelector(state);
  return findDataModelObject(fiscalIdId, fiscalIds);
};
const fiscalIdMappersSelector = (_state: State) => getFiscalIdMappers();
const fiscalIdMatchSelector = () => fiscalIdMatch;
export const queryFiscalIdsSelector = getQuerySelector(
  fiscalIdsSelector,
  fiscalIdMatchSelector,
  fiscalIdMappersSelector
);
