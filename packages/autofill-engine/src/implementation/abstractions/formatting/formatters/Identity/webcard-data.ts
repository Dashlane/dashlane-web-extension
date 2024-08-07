import {
  IdentityAutofillView,
  VaultSourceType,
} from "@dashlane/autofill-contracts";
import { PremiumStatusSpaceItemView } from "@dashlane/communication";
import { getAutofillDataFromVault } from "../../../vault/get";
import { AutofillEngineContext } from "../../../../../Api/server/context";
import { SomeDataCaptureWebcardItem } from "../../../../../Api/types/data-capture";
import { SimpleWebcardItem, WebcardItemType } from "../../../../../types";
import { CapturedValuesAndProperties } from "../../../../modules/dataCapture/personal-data-capture-helpers";
import { convertSpaceInfoForWebcard } from "../../converters";
import { buildItemProperties, findCapturedDataByProperty } from "../../utils";
import { getDateFormat, parseDate } from "../Dates/helpers";
import { formatBirthdateForDataCapture } from "../Dates/webcard-data";
import {
  formatBirthInformationForWebcards,
  formatFullNameWithPseudo,
  NBSP,
} from "./helpers";
export const buildIdentityItemProperties = async (
  context: AutofillEngineContext,
  identityId: string
) => {
  const identityItem = await getAutofillDataFromVault(
    context,
    VaultSourceType.Identity,
    identityId
  );
  return identityItem
    ? buildItemProperties(context, VaultSourceType.Identity, identityItem, [
        "title",
        "firstName",
        "middleName",
        "middleNameInitial",
        "lastName",
        "lastName2",
        "pseudo",
        "birthDate",
        "birthPlace",
        "age",
      ])
    : {};
};
export const getFormattedIdentityWebcardData = (
  identityItem: IdentityAutofillView,
  premiumStatusSpace?: PremiumStatusSpaceItemView
): SimpleWebcardItem => {
  return {
    type: WebcardItemType.SimpleItem,
    itemId: identityItem.id,
    itemType: VaultSourceType.Identity,
    title: formatFullNameWithPseudo(identityItem),
    content: formatBirthInformationForWebcards(identityItem),
    space: convertSpaceInfoForWebcard(premiumStatusSpace),
    isProtected: false,
  };
};
export const getIdentityDataCapture = (
  capturedData: CapturedValuesAndProperties<VaultSourceType>
): SomeDataCaptureWebcardItem<VaultSourceType.Identity> | undefined => {
  if (!capturedData[0]) {
    return undefined;
  }
  const birthDate = findCapturedDataByProperty(capturedData, "birthDate");
  const birthDay = findCapturedDataByProperty(capturedData, "birthDay");
  const birthMonth = findCapturedDataByProperty(capturedData, "birthMonth");
  const birthYear = findCapturedDataByProperty(capturedData, "birthYear");
  let formattedBirthDate = "";
  if (birthDate?.format?.dateFormat) {
    formattedBirthDate = formatBirthdateForDataCapture(
      parseDate(birthDate.value, getDateFormat(birthDate.format.dateFormat))
    );
  } else if (birthDay && birthMonth && birthYear) {
    formattedBirthDate = formatBirthdateForDataCapture({
      day: birthDay.value,
      month: birthMonth.value,
      year: birthYear.value,
    });
  }
  const content = [
    findCapturedDataByProperty(capturedData, "firstName")?.value,
    findCapturedDataByProperty(capturedData, "lastName")?.value,
  ]
    .filter(Boolean)
    .join(`,${NBSP}`);
  return {
    type: VaultSourceType.Identity,
    content,
    firstName:
      findCapturedDataByProperty(capturedData, "firstName")?.value ?? "",
    lastName: findCapturedDataByProperty(capturedData, "lastName")?.value ?? "",
    birthDate: formattedBirthDate,
    birthPlace:
      findCapturedDataByProperty(capturedData, "birthPlace")?.value ?? "",
  };
};
