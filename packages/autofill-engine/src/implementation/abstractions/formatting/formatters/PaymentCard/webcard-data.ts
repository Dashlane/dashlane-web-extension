import {
  PaymentCardAutofillView,
  VaultSourceType,
} from "@dashlane/autofill-contracts";
import { PremiumStatusSpaceItemView } from "@dashlane/communication";
import { AutofillEngineContext } from "../../../../../Api/server/context";
import { getAutofillDataFromVault } from "../../../vault/get";
import {
  EnhancedWebcardItem,
  SomeDataCaptureWebcardItem,
  WebcardItemType,
} from "../../../../../types";
import { CapturedValuesAndProperties } from "../../../../modules/dataCapture/personal-data-capture-helpers";
import { convertSpaceInfoForWebcard } from "../../converters";
import {
  buildItemProperties,
  findCapturedDataByProperty,
  getExpirationWarningsForEnhancedWebcardItems,
} from "../../utils";
import {
  getDateFormat,
  getFullYearFromShort,
  parseDate,
} from "../Dates/helpers";
import { ParsedDate } from "../Dates/types";
import {
  formatOwnerNameFromCapturedData,
  getFormattedLastDigits,
  isValidCardNumberLength,
  NBSP,
} from "./helpers";
const formatExpirationDateFromCapturedData = (
  capturedData: CapturedValuesAndProperties<VaultSourceType>
): ParsedDate => {
  const monthCaptured = findCapturedDataByProperty(capturedData, "expireMonth");
  const yearCaptured = findCapturedDataByProperty(capturedData, "expireYear");
  const expirationDate: ParsedDate = {
    month: monthCaptured?.value,
    year: yearCaptured?.value,
  };
  if (
    (monthCaptured?.value && monthCaptured.format?.dateFormat) ||
    (yearCaptured?.value && yearCaptured.format?.dateFormat)
  ) {
    const selectedCaptured = monthCaptured?.format?.dateFormat
      ? monthCaptured
      : yearCaptured;
    if (selectedCaptured) {
      const { month, year } = parseDate(
        selectedCaptured.value,
        getDateFormat(selectedCaptured.format?.dateFormat)
      );
      expirationDate.month = month;
      expirationDate.year = year;
    }
  }
  if (!!expirationDate.year && expirationDate.year.length === 2) {
    expirationDate.year = getFullYearFromShort(expirationDate.year);
  }
  return expirationDate;
};
export const getCreditCardDataCapture = (
  capturedData: CapturedValuesAndProperties<VaultSourceType>
): SomeDataCaptureWebcardItem<VaultSourceType.PaymentCard> | undefined => {
  const rawCardNumber =
    findCapturedDataByProperty(capturedData, "cardNumber")?.value ?? "";
  const securityCode =
    findCapturedDataByProperty(capturedData, "securityCode")?.value ?? "";
  const cardNumber = rawCardNumber.replace(/\s/g, "");
  const isValidSecurityCode = !!securityCode && securityCode.length === 3;
  const isValidCardNumber = !!cardNumber && isValidCardNumberLength(cardNumber);
  if (!capturedData[0] || !isValidCardNumber || !isValidSecurityCode) {
    return undefined;
  }
  const { month: expireMonth, year: expireYear } =
    formatExpirationDateFromCapturedData(capturedData);
  return {
    type: VaultSourceType.PaymentCard,
    content: findCapturedDataByProperty(capturedData, "name")?.value ?? "",
    cardName: findCapturedDataByProperty(capturedData, "name")?.value ?? "",
    ownerName: formatOwnerNameFromCapturedData(capturedData),
    expireMonth: expireMonth ?? "",
    expireYear: expireYear ?? "",
    securityCode,
    cardNumber,
  };
};
export const buildPaymentCardItemProperties = async (
  context: AutofillEngineContext,
  paymentCardId: string
) => {
  const paymentCardItem = await getAutofillDataFromVault(
    context,
    VaultSourceType.PaymentCard,
    paymentCardId
  );
  return paymentCardItem
    ? buildItemProperties(
        context,
        VaultSourceType.PaymentCard,
        paymentCardItem,
        ["ownerName", "cardNumber", "securityCode", "expireDate"]
      )
    : {};
};
export const getFormattedPaymentCardWebcardItem = (
  paymentCardItem: PaymentCardAutofillView,
  premiumStatusSpace?: PremiumStatusSpaceItemView
): EnhancedWebcardItem => {
  const { expireMonth, expireYear } = paymentCardItem;
  const expirationYear = parseInt(expireYear, 10);
  const expirationMonth = parseInt(expireMonth, 10);
  const { expired, aboutToExpire } =
    getExpirationWarningsForEnhancedWebcardItems(
      expirationMonth,
      expirationYear,
      paymentCardItem.vaultType
    );
  const incomplete = !paymentCardItem.cardNumber;
  const formattedlastDigits = paymentCardItem.cardNumberLastDigits
    ? getFormattedLastDigits(paymentCardItem.cardNumberLastDigits, "short")
    : "";
  const formattedExpirationDate =
    expireMonth && expireYear
      ? `${expireMonth.padStart(2, "0")}/${expireYear.slice(-2)}`
      : "";
  const content =
    formattedlastDigits + NBSP.repeat(3) + formattedExpirationDate;
  return {
    type: WebcardItemType.EnhancedItem,
    itemId: paymentCardItem.id,
    itemType: VaultSourceType.PaymentCard,
    title: paymentCardItem.name,
    content,
    space: convertSpaceInfoForWebcard(premiumStatusSpace),
    expired,
    aboutToExpire: aboutToExpire && !expired,
    incomplete: incomplete && !aboutToExpire && !expired,
    paymentType: paymentCardItem.type,
    color: paymentCardItem.color.toLowerCase(),
    isProtected: true,
  };
};
