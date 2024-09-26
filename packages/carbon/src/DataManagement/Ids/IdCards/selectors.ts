import { createSelector } from "reselect";
import { IdCard, IdCardWithIdentity, Identity } from "@dashlane/communication";
import { State } from "Store";
import { idCardMatch } from "DataManagement/Ids/IdCards/search";
import { getQuerySelector } from "DataManagement/query-selector";
import { findDataModelObject } from "DataManagement/PersonalData/utils";
import { getIdCardMappers } from "DataManagement/Ids/IdCards/mappers";
import { identitiesByIdSelector } from "DataManagement/PersonalInfo/Identity/selectors";
import { filterOutQuarantinedItems } from "DataManagement/quarantined-filter";
import { quarantinedSpacesSelector } from "DataManagement/SmartTeamSpaces/forced-categorization.selectors";
const allUnsafeIdCardsSelector = (state: State): IdCard[] =>
  state.userSession.personalData.idCards;
export const idCardsSelector = createSelector(
  allUnsafeIdCardsSelector,
  quarantinedSpacesSelector,
  filterOutQuarantinedItems
);
export const idCardSelector = (state: State, idCardId: string): IdCard => {
  const idCards = idCardsSelector(state);
  return findDataModelObject(idCardId, idCards);
};
const idCardsWithIdentitySelector: (state: State) => IdCardWithIdentity[] =
  createSelector(
    [idCardsSelector, identitiesByIdSelector],
    (
      idCards: IdCard[],
      identities: {
        string: Identity;
      }
    ) =>
      idCards.map((idCard: IdCard) => ({
        ...idCard,
        identity: identities[idCard.LinkedIdentity],
      }))
  );
export const idCardWithIdentitySelector: (
  state: State,
  idCardId: string
) => IdCardWithIdentity = createSelector(
  [idCardSelector, (state: State) => identitiesByIdSelector(state)],
  (
    idCard: IdCard,
    identities: {
      string: Identity;
    }
  ) => ({
    ...idCard,
    identity: identities[idCard.LinkedIdentity],
  })
);
const idCardMappersSelector = (_state: State) => getIdCardMappers();
const idCardMatchSelector = () => idCardMatch;
export const queryIdCardsSelector = getQuerySelector(
  idCardsWithIdentitySelector,
  idCardMatchSelector,
  idCardMappersSelector
);
