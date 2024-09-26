import { Phone } from "@dashlane/communication";
import { State } from "Store";
import { phoneMatch } from "DataManagement/PersonalInfo/Phone/search";
import { getPhoneMappers } from "DataManagement/PersonalInfo/Phone/mappers";
import { getQuerySelector } from "DataManagement/query-selector";
import { findDataModelObject } from "DataManagement/PersonalData/utils";
import { createSelector } from "reselect";
import { filterOutQuarantinedItems } from "DataManagement/quarantined-filter";
import { quarantinedSpacesSelector } from "DataManagement/SmartTeamSpaces/forced-categorization.selectors";
const allUnsafePhonesSelector = (state: State): Phone[] =>
  state.userSession.personalData.phones;
export const phonesSelector = createSelector(
  allUnsafePhonesSelector,
  quarantinedSpacesSelector,
  filterOutQuarantinedItems
);
export const phoneSelector = (state: State, phoneId: string): Phone => {
  const phones = phonesSelector(state);
  return findDataModelObject(phoneId, phones);
};
const phoneMappersSelector = (_state: State) => getPhoneMappers();
const phoneMatchSelector = () => phoneMatch;
export const queryPhonesSelector = getQuerySelector(
  phonesSelector,
  phoneMatchSelector,
  phoneMappersSelector
);
