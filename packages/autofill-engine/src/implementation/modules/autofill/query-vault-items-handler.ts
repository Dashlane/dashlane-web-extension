import {
  VaultAutofillViewInterfaces,
  VaultSourceType,
} from "@dashlane/autofill-contracts";
import { AutofillEngineContext } from "../../../Api/server/context";
import { AutofillRecipeBySourceType, SrcElementDetails } from "../../../types";
import {
  AutofillEngineActionsWithOptions,
  AutofillEngineActionTarget,
} from "../../abstractions/messaging/action-serializer";
import { searchAllAutofillDataFromVault } from "../../abstractions/vault/get";
import { getFormattedWebcardItem } from "./get-formatted-webcard-item";
import { buildAutofillDropdownWebcardItems } from "./user-focus-on-element-handler";
export interface QueryVaultItemsOptions {
  autofillRecipes: AutofillRecipeBySourceType;
  formClassification: string;
  srcElementDetails: SrcElementDetails;
}
const SEARCHABLE_IN_WEBCARDS = [
  VaultSourceType.Address,
  VaultSourceType.BankAccount,
  VaultSourceType.Company,
  VaultSourceType.Credential,
  VaultSourceType.DriverLicense,
  VaultSourceType.Email,
  VaultSourceType.FiscalId,
  VaultSourceType.IdCard,
  VaultSourceType.Identity,
  VaultSourceType.Passport,
  VaultSourceType.PaymentCard,
  VaultSourceType.PersonalWebsite,
  VaultSourceType.Phone,
  VaultSourceType.SocialSecurityId,
];
export const queryVaultItemsHandler = async (
  context: AutofillEngineContext,
  actions: AutofillEngineActionsWithOptions,
  sender: chrome.runtime.MessageSender,
  queryString: string,
  options?: QueryVaultItemsOptions
) => {
  const tabUrl = sender.tab?.url;
  if (!tabUrl) {
    return;
  }
  const fetchInEntireVault = async () => {
    const items = await searchAllAutofillDataFromVault({
      context,
      searchQuery: queryString,
      itemTypes: SEARCHABLE_IN_WEBCARDS,
      sorting: { property: "lastUse", direction: "descend" },
    });
    return items.map((item) =>
      getFormattedWebcardItem({
        vaultType: item.vaultType,
        vaultItem: item as VaultAutofillViewInterfaces[typeof item.vaultType],
      })
    );
  };
  const webcardItems = options
    ? (
        await buildAutofillDropdownWebcardItems(
          context,
          tabUrl,
          sender,
          {
            formClassification: options.formClassification,
            autofillRecipes: options.autofillRecipes,
            ...options.srcElementDetails,
          },
          queryString
        )
      ).webcardItems
    : await fetchInEntireVault();
  actions.updateWebcardItems(
    AutofillEngineActionTarget.SenderFrame,
    webcardItems
  );
};
