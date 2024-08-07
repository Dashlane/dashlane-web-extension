import { VaultSourceType } from "@dashlane/autofill-contracts";
import { AutofillEngineContext } from "../../../Api/server/context";
import { AutofillRecipeBySourceType, SrcElementDetails } from "../../../types";
import {
  AutofillEngineActionsWithOptions,
  AutofillEngineActionTarget,
} from "../../abstractions/messaging/action-serializer";
import { buildCredentialItemProperties } from "../../abstractions/formatting/formatters/Credential/webcard-data";
import { buildAddressItemProperties } from "../../abstractions/formatting/formatters/Address/webcard-data";
import { buildBankAccountItemProperties } from "../../abstractions/formatting/formatters/BankAccount/webcard-data";
import { buildDriverLicenseItemProperties } from "../../abstractions/formatting/formatters/DriverLicense/webcard-data";
import { buildCompanyItemProperties } from "../../abstractions/formatting/formatters/Company/webcard-data";
import { buildPaymentCardItemProperties } from "../../abstractions/formatting/formatters/PaymentCard/webcard-data";
import { buildIdCardItemProperties } from "../../abstractions/formatting/formatters/IdCard/webcard-data";
import { buildIdentityItemProperties } from "../../abstractions/formatting/formatters/Identity/webcard-data";
import { buildPhoneItemProperties } from "../../abstractions/formatting/formatters/Phone/webcard-data";
import { buildEmailItemProperties } from "../../abstractions/formatting/formatters/Email/webcard-data";
import { buildPassportItemProperties } from "../../abstractions/formatting/formatters/Passport/webcard-data";
import { buildFiscalIdItemProperties } from "../../abstractions/formatting/formatters/FiscalId/webcard-data";
import { buildPersonalWebsiteItemProperties } from "../../abstractions/formatting/formatters/PersonalWebsite/webcard-data";
import { buildSocialSecurityItemProperties } from "../../abstractions/formatting/formatters/SocialSecurity/webcard-data";
export interface QueryVaultItemsOptions {
  autofillRecipes: AutofillRecipeBySourceType;
  formClassification: string;
  srcElementDetails: SrcElementDetails;
}
export const getVaultItemDetailsHandler = async <T extends VaultSourceType>(
  context: AutofillEngineContext,
  actions: AutofillEngineActionsWithOptions,
  _sender: chrome.runtime.MessageSender,
  itemId: string,
  itemType: T
) => {
  let itemProperties = {};
  switch (itemType) {
    case VaultSourceType.Address:
      itemProperties = await buildAddressItemProperties(context, itemId);
      break;
    case VaultSourceType.BankAccount:
      itemProperties = await buildBankAccountItemProperties(context, itemId);
      break;
    case VaultSourceType.Company:
      itemProperties = await buildCompanyItemProperties(context, itemId);
      break;
    case VaultSourceType.Credential:
      itemProperties = await buildCredentialItemProperties(context, itemId);
      break;
    case VaultSourceType.DriverLicense:
      itemProperties = await buildDriverLicenseItemProperties(context, itemId);
      break;
    case VaultSourceType.Email:
      itemProperties = await buildEmailItemProperties(context, itemId);
      break;
    case VaultSourceType.FiscalId:
      itemProperties = await buildFiscalIdItemProperties(context, itemId);
      break;
    case VaultSourceType.IdCard:
      itemProperties = await buildIdCardItemProperties(context, itemId);
      break;
    case VaultSourceType.Identity:
      itemProperties = await buildIdentityItemProperties(context, itemId);
      break;
    case VaultSourceType.Passport:
      itemProperties = await buildPassportItemProperties(context, itemId);
      break;
    case VaultSourceType.PaymentCard:
      itemProperties = await buildPaymentCardItemProperties(context, itemId);
      break;
    case VaultSourceType.PersonalWebsite:
      itemProperties = await buildPersonalWebsiteItemProperties(
        context,
        itemId
      );
      break;
    case VaultSourceType.Phone:
      itemProperties = await buildPhoneItemProperties(context, itemId);
      break;
    case VaultSourceType.SocialSecurityId:
      itemProperties = await buildSocialSecurityItemProperties(context, itemId);
      break;
  }
  actions.updateWebcardItemDetails(
    AutofillEngineActionTarget.SenderFrame,
    itemId,
    itemType,
    itemProperties
  );
};
