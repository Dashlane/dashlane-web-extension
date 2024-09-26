import { BankAccount } from "@dashlane/communication";
import { State } from "Store";
import { bankAccountMatch } from "DataManagement/BankAccounts/search";
import { getQuerySelector } from "DataManagement/query-selector";
import { findDataModelObject } from "DataManagement/PersonalData/utils";
import { createSelector } from "reselect";
import { getBankAccountMappers } from "DataManagement/BankAccounts/mappers";
import { quarantinedSpacesSelector } from "DataManagement/SmartTeamSpaces/forced-categorization.selectors";
import { filterOutQuarantinedItems } from "DataManagement/quarantined-filter";
const allUnsafeBankAccountsSelector = (state: State): BankAccount[] =>
  state.userSession.personalData.bankAccounts;
export const bankAccountsSelector = createSelector(
  allUnsafeBankAccountsSelector,
  quarantinedSpacesSelector,
  filterOutQuarantinedItems
);
export const bankAccountSelector = (
  state: State,
  bankAccountId: string
): BankAccount => {
  const bankAccounts = bankAccountsSelector(state);
  return findDataModelObject(bankAccountId, bankAccounts);
};
const bankAccountMappersSelector = (_state: State) => getBankAccountMappers();
const bankAccountMatchSelector = () => bankAccountMatch;
export const queryBankAccountsSelector = getQuerySelector(
  bankAccountsSelector,
  bankAccountMatchSelector,
  bankAccountMappersSelector
);
