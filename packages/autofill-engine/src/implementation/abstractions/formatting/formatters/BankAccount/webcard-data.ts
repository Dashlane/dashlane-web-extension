import {
  BankAccountAutofillView,
  VaultSourceType,
} from "@dashlane/autofill-contracts";
import { PremiumStatusSpaceItemView } from "@dashlane/communication";
import { getAutofillDataFromVault } from "../../../../abstractions/vault/get";
import { AutofillEngineContext } from "../../../../../Api/server/context";
import { SimpleWebcardItem, WebcardItemType } from "../../../../../types";
import { convertSpaceInfoForWebcard } from "../../converters";
import { buildItemProperties } from "../../utils";
export const buildBankAccountItemProperties = async (
  context: AutofillEngineContext,
  bankAccountId: string
) => {
  const bankAccountItem = await getAutofillDataFromVault(
    context,
    VaultSourceType.BankAccount,
    bankAccountId
  );
  return bankAccountItem
    ? buildItemProperties(
        context,
        VaultSourceType.BankAccount,
        bankAccountItem,
        ["owner", "bank", "BIC", "IBAN"]
      )
    : {};
};
export const getFormattedBankAccountWebcardData = (
  bankAccountItem: BankAccountAutofillView,
  premiumStatusSpace?: PremiumStatusSpaceItemView
): SimpleWebcardItem => {
  return {
    type: WebcardItemType.SimpleItem,
    itemId: bankAccountItem.id,
    itemType: VaultSourceType.BankAccount,
    title: bankAccountItem.name,
    content: bankAccountItem.owner,
    space: convertSpaceInfoForWebcard(premiumStatusSpace),
    isProtected: false,
  };
};
