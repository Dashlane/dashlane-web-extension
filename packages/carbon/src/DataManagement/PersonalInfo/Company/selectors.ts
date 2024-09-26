import { Company } from "@dashlane/communication";
import { State } from "Store";
import { companyMatch } from "DataManagement/PersonalInfo/Company/search";
import { getCompanyMappers } from "DataManagement/PersonalInfo/Company/mappers";
import { getQuerySelector } from "DataManagement/query-selector";
import { findDataModelObject } from "DataManagement/PersonalData/utils";
import { createSelector } from "reselect";
import { filterOutQuarantinedItems } from "DataManagement/quarantined-filter";
import { quarantinedSpacesSelector } from "DataManagement/SmartTeamSpaces/forced-categorization.selectors";
const allUnsafeCompaniesSelector = (state: State): Company[] =>
  state.userSession.personalData.companies;
export const companiesSelector = createSelector(
  allUnsafeCompaniesSelector,
  quarantinedSpacesSelector,
  filterOutQuarantinedItems
);
export const companySelector = (
  state: State,
  companyId: string
): Company | undefined => {
  const companies = companiesSelector(state);
  return findDataModelObject(companyId, companies);
};
const companyMappersSelector = (_state: State) => getCompanyMappers();
const companyMatchSelector = () => companyMatch;
export const queryCompaniesSelector = getQuerySelector(
  companiesSelector,
  companyMatchSelector,
  companyMappersSelector
);
