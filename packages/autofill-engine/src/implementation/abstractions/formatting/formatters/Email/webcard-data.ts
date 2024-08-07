import {
  EmailAutofillView,
  VaultSourceType,
} from "@dashlane/autofill-contracts";
import { PremiumStatusSpaceItemView } from "@dashlane/communication";
import { getAutofillDataFromVault } from "../../../../abstractions/vault/get";
import { AutofillEngineContext } from "../../../../../Api/server/context";
import { SomeDataCaptureWebcardItem } from "../../../../../Api/types/data-capture";
import { SimpleWebcardItem, WebcardItemType } from "../../../../../types";
import { CapturedValuesAndProperties } from "../../../../modules/dataCapture/personal-data-capture-helpers";
import { convertSpaceInfoForWebcard } from "../../converters";
import { buildItemProperties, findCapturedDataByProperty } from "../../utils";
export const buildEmailItemProperties = async (
  context: AutofillEngineContext,
  emailId: string
) => {
  const emailItem = await getAutofillDataFromVault(
    context,
    VaultSourceType.Email,
    emailId
  );
  return emailItem
    ? buildItemProperties(context, VaultSourceType.Email, emailItem, ["email"])
    : {};
};
export const getFormattedEmailWebcardData = (
  emailItem: EmailAutofillView,
  premiumStatusSpace?: PremiumStatusSpaceItemView
): SimpleWebcardItem => {
  return {
    type: WebcardItemType.SimpleItem,
    itemId: emailItem.id,
    itemType: VaultSourceType.Email,
    title: emailItem.email,
    content: emailItem.name,
    communicationType: emailItem.type,
    space: convertSpaceInfoForWebcard(premiumStatusSpace),
    isProtected: false,
  };
};
export const getEmailDataCapture = (
  capturedData: CapturedValuesAndProperties<VaultSourceType>
): SomeDataCaptureWebcardItem<VaultSourceType.Email> | undefined => {
  if (!capturedData[0]) {
    return undefined;
  }
  return {
    type: VaultSourceType.Email,
    content: findCapturedDataByProperty(capturedData, "email")?.value ?? "",
    email: findCapturedDataByProperty(capturedData, "email")?.value ?? "",
  };
};
