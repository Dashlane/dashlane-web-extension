import { createSelector } from "reselect";
import {
  DriverLicense,
  DriverLicenseWithIdentity,
  Identity,
} from "@dashlane/communication";
import { State } from "Store";
import { driverLicenseMatch } from "DataManagement/Ids/DriverLicenses/search";
import { getQuerySelector } from "DataManagement/query-selector";
import { findDataModelObject } from "DataManagement/PersonalData/utils";
import { getDriverLicenseMappers } from "DataManagement/Ids/DriverLicenses/mappers";
import { identitiesByIdSelector } from "DataManagement/PersonalInfo/Identity/selectors";
import { filterOutQuarantinedItems } from "DataManagement/quarantined-filter";
import { quarantinedSpacesSelector } from "DataManagement/SmartTeamSpaces/forced-categorization.selectors";
const allUnsafeDriverLicensesSelector = (state: State): DriverLicense[] =>
  state.userSession.personalData.driverLicenses;
export const driverLicensesSelector = createSelector(
  allUnsafeDriverLicensesSelector,
  quarantinedSpacesSelector,
  filterOutQuarantinedItems
);
export const driverLicenseSelector = (
  state: State,
  driverLicenseId: string
): DriverLicense => {
  const driverLicenses = driverLicensesSelector(state);
  return findDataModelObject(driverLicenseId, driverLicenses);
};
const driverLicenseMappersSelector = (_state: State) =>
  getDriverLicenseMappers();
const driverLicensesWithIdentitySelector: (
  state: State
) => DriverLicenseWithIdentity[] = createSelector(
  [driverLicensesSelector, identitiesByIdSelector],
  (
    driverLicenses: DriverLicense[],
    identities: {
      string: Identity;
    }
  ) =>
    driverLicenses.map((driverLicense: DriverLicense) => ({
      ...driverLicense,
      identity: identities[driverLicense.LinkedIdentity],
    }))
);
export const driverLicenseWithIdentitySelector: (
  state: State,
  driverLicenseId: string
) => DriverLicenseWithIdentity = createSelector(
  [driverLicenseSelector, (state: State) => identitiesByIdSelector(state)],
  (
    driverLicense: DriverLicense,
    identities: {
      string: Identity;
    }
  ) => ({
    ...driverLicense,
    identity: identities[driverLicense.LinkedIdentity],
  })
);
const driverLicenseMatchSelector = () => driverLicenseMatch;
export const queryDriverLicensesSelector = getQuerySelector(
  driverLicensesWithIdentitySelector,
  driverLicenseMatchSelector,
  driverLicenseMappersSelector
);
