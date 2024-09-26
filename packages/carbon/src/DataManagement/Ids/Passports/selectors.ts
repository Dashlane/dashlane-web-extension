import { createSelector } from "reselect";
import {
  Identity,
  Passport,
  PassportWithIdentity,
} from "@dashlane/communication";
import { State } from "Store";
import { passportMatch } from "DataManagement/Ids/Passports/search";
import { getQuerySelector } from "DataManagement/query-selector";
import { findDataModelObject } from "DataManagement/PersonalData/utils";
import { getPassportMappers } from "DataManagement/Ids/Passports/mappers";
import { identitiesByIdSelector } from "DataManagement/PersonalInfo/Identity/selectors";
import { filterOutQuarantinedItems } from "DataManagement/quarantined-filter";
import { quarantinedSpacesSelector } from "DataManagement/SmartTeamSpaces/forced-categorization.selectors";
const allUnsafePassportsSelector = (state: State): Passport[] =>
  state.userSession.personalData.passports;
export const passportsSelector = createSelector(
  allUnsafePassportsSelector,
  quarantinedSpacesSelector,
  filterOutQuarantinedItems
);
export const passportSelector = (
  state: State,
  passportId: string
): Passport => {
  const passports = passportsSelector(state);
  return findDataModelObject(passportId, passports);
};
const passportsWithIdentitySelector: (state: State) => PassportWithIdentity[] =
  createSelector(
    [passportsSelector, identitiesByIdSelector],
    (
      passports: Passport[],
      identities: {
        string: Identity;
      }
    ) =>
      passports.map((passport: Passport) => ({
        ...passport,
        identity: identities[passport.LinkedIdentity],
      }))
  );
export const passportWithIdentitySelector: (
  state: State,
  passportId: string
) => PassportWithIdentity = createSelector(
  [passportSelector, (state: State) => identitiesByIdSelector(state)],
  (
    passport: Passport,
    identities: {
      string: Identity;
    }
  ) => ({
    ...passport,
    identity: identities[passport.LinkedIdentity],
  })
);
export const passportMappersSelector = (_state: State) => getPassportMappers();
const passportMatchSelector = () => passportMatch;
export const queryPassportsWithIdentitySelector = getQuerySelector(
  passportsWithIdentitySelector,
  passportMatchSelector,
  passportMappersSelector
);
