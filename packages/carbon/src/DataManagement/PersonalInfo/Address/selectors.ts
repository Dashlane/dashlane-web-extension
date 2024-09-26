import { Address } from "@dashlane/communication";
import { State } from "Store";
import { addressMatch } from "DataManagement/PersonalInfo/Address/search";
import { getAddressMappers } from "DataManagement/PersonalInfo/Address/mappers";
import { getQuerySelector } from "DataManagement/query-selector";
import { findDataModelObject } from "DataManagement/PersonalData/utils";
import { createSelector } from "reselect";
import { filterOutQuarantinedItems } from "DataManagement/quarantined-filter";
import { quarantinedSpacesSelector } from "DataManagement/SmartTeamSpaces/forced-categorization.selectors";
const allUnsafeAddressesSelector = (state: State): Address[] =>
  state.userSession.personalData.addresses;
export const addressesSelector = createSelector(
  allUnsafeAddressesSelector,
  quarantinedSpacesSelector,
  filterOutQuarantinedItems
);
export const addressSelector = (
  state: State,
  addressId: string
): Address | undefined => {
  const addresses = addressesSelector(state);
  return findDataModelObject(addressId, addresses);
};
const addressMappersSelector = (_state: State) => getAddressMappers();
const addressMatchSelector = () => addressMatch;
export const queryAddressesSelector = getQuerySelector(
  addressesSelector,
  addressMatchSelector,
  addressMappersSelector
);
