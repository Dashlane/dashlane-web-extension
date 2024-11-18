import {
  VaultAutofillViewInterfaces,
  VaultSourceType,
} from "@dashlane/autofill-contracts";
import { AutofillEngineContext } from "../../../Api/server/context";
import {
  AutofillRecipeBySourceType,
  SrcElementDetails,
  WebcardItem,
} from "../../../types";
import {
  AutofillEngineActionsWithOptions,
  AutofillEngineActionTarget,
} from "../../abstractions/messaging/action-serializer";
import { searchAllAutofillDataFromVault } from "../../abstractions/vault/get";
import { getFormattedWebcardItem } from "./get-formatted-webcard-item";
import {
  buildAutofillDropdownWebcardItems,
  MAX_NUMBER_OF_ITEMS_IN_DROPDOWN,
} from "./user-focus-on-element-handler";
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
  let items: WebcardItem[] = [];
  let count = 0;
  if (options) {
    items = (
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
    ).webcardItems;
    count = items.length;
  } else {
    const result = await searchAllAutofillDataFromVault({
      context,
      searchQuery: queryString,
      itemTypes: SEARCHABLE_IN_WEBCARDS,
      sorting: { property: "lastUse", direction: "descend" },
      limit: MAX_NUMBER_OF_ITEMS_IN_DROPDOWN,
    });
    items = result.items.map((item) =>
      getFormattedWebcardItem({
        vaultType: item.vaultType,
        vaultItem: item as VaultAutofillViewInterfaces[typeof item.vaultType],
      })
    );
    count = result.count;
  }
  actions.updateWebcardItems(
    AutofillEngineActionTarget.SenderFrame,
    items,
    count
  );
};
