import { compose } from "ramda";
import {
  Passkey,
  PasskeyDetailView,
  PasskeysForDomainDataQuery,
} from "@dashlane/communication";
import { ParsedURL } from "@dashlane/url-parser";
import { State } from "Store";
import { passkeyMatch } from "DataManagement/Passkeys/search";
import { detailView, listView } from "DataManagement/Passkeys/views";
import { getQuerySelector } from "DataManagement/query-selector";
import { viewListResults } from "DataManagement/Search/views";
import { makeLiveSelectorGetter } from "DataManagement/live-selector-getter";
import { findDataModelObject } from "DataManagement/PersonalData/utils";
import { createSelector } from "reselect";
import { getPasskeyMappers } from "DataManagement/Passkeys/mappers";
const allUnsafePasskeysSelector = (state: State): Passkey[] =>
  state.userSession.personalData.passkeys;
export const passkeysSelector = allUnsafePasskeysSelector;
export const passkeySelector = (state: State, passkeyId: string): Passkey => {
  const passkeys = allUnsafePasskeysSelector(state);
  return findDataModelObject(passkeyId, passkeys);
};
export const passkeyMappersSelector = (_state: State) => getPasskeyMappers();
const passkeyMatchSelector = () => passkeyMatch;
export const queryPasskeysSelector = getQuerySelector(
  passkeysSelector,
  passkeyMatchSelector,
  passkeyMappersSelector
);
export const viewedQueriedPasskeysSelector = compose(
  viewListResults(listView),
  queryPasskeysSelector
);
export const getLivePasskeysSelector = makeLiveSelectorGetter(
  passkeysSelector,
  () => listView,
  passkeyMatchSelector,
  passkeyMappersSelector
);
export const viewedPasskeySelector = (
  state: State,
  passkeyId: string
): PasskeyDetailView | undefined => {
  const passkey = passkeySelector(state, passkeyId);
  return detailView(passkey);
};
export const getViewedPasskeySelector = (passkeyId: string) => {
  const passkeySelector = createSelector(passkeysSelector, (passkeys) =>
    findDataModelObject(passkeyId, passkeys)
  );
  return createSelector(passkeySelector, detailView);
};
const filterPasskeysByDomain = (passkeys: Passkey[], url: string) => {
  return passkeys.filter((passkey) => {
    const passkeyRpIdFullDomain = new ParsedURL(passkey.RpId).getHostname();
    const urlFullDomain = new ParsedURL(url).getHostname();
    return (
      urlFullDomain === passkeyRpIdFullDomain ||
      urlFullDomain.endsWith(`.${passkeyRpIdFullDomain}`)
    );
  });
};
export const getPasskeysByFullDomainSelector = (domain: string) =>
  createSelector(passkeysSelector, (passkeys) =>
    filterPasskeysByDomain(passkeys, domain)
  );
export const queryPasskeysByDomainSelector = (domain: string) =>
  getQuerySelector(
    getPasskeysByFullDomainSelector(domain),
    passkeyMatchSelector,
    passkeyMappersSelector
  );
export const viewedQueriedPasskeysForDomainSelector = (
  state: State,
  dataQuery: PasskeysForDomainDataQuery
) => {
  const queryByDomainSelector = queryPasskeysByDomainSelector(dataQuery.domain);
  const queryResults = queryByDomainSelector(state, dataQuery);
  return viewListResults(listView)(queryResults);
};
