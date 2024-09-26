import { Trigger } from "@dashlane/hermes";
import {
  AddPaymentCardRequest,
  Country,
  PaymentCard,
  PaymentCardSaveResult,
  PaymentCardSaveResultErrorCode,
} from "@dashlane/communication";
import { CoreServices } from "Services";
import { getDebounceSync, getDefaultSpaceId } from "DataManagement/utils";
import {
  defaultToEmptyString,
  defaultToFallbackColor,
  getLastDigitsFromCardNumber,
  getPaymentTypeFromCardNumber,
  RequestError,
} from "DataManagement/PaymentCards/helpers";
import { savePersonalDataItem } from "Session/Store/actions";
import { getUnixTimestamp } from "Utils/getUnixTimestamp";
import { generateItemUuid } from "Utils/generateItemUuid";
import { sendExceptionLog } from "Logs/Exception";
import { sanitizeInputPersonalData } from "DataManagement/PersonalData/sanitize";
import { logAddVaultItem } from "DataManagement/PersonalData/logs";
export function getNewPaymentCard(
  newPaymentCardData: AddPaymentCardRequest
): PaymentCard {
  newPaymentCardData = sanitizeInputPersonalData(newPaymentCardData);
  const paymentCardCreationDate = getUnixTimestamp();
  const cardNumber = defaultToEmptyString(
    newPaymentCardData.cardNumber
  ).replace(/ /g, "");
  if (!cardNumber && !newPaymentCardData.securityCode) {
    throw new RequestError(
      "[addPaymentCard]: refusing to add a payment card without card number or security code.",
      PaymentCardSaveResultErrorCode.EMPTY_CARD_NUMBER_AND_SECURITY_CODE
    );
  }
  const paymentCard: PaymentCard = {
    kwType: "KWPaymentMean_creditCard",
    Bank: "US-NO_TYPE",
    CardNumber: cardNumber,
    CardNumberLastDigits: getLastDigitsFromCardNumber(cardNumber),
    CreationDatetime: paymentCardCreationDate,
    Color: defaultToFallbackColor(newPaymentCardData.color),
    ExpireMonth: defaultToEmptyString(newPaymentCardData.expireMonth),
    ExpireYear: defaultToEmptyString(newPaymentCardData.expireYear),
    Id: generateItemUuid(),
    IssueNumber: "",
    Name: defaultToEmptyString(newPaymentCardData.name),
    OwnerName: defaultToEmptyString(newPaymentCardData.ownerName),
    CCNote: defaultToEmptyString(newPaymentCardData.personalNote),
    LocaleFormat: Country.US,
    SecurityCode: defaultToEmptyString(newPaymentCardData.securityCode),
    SpaceId: defaultToEmptyString(newPaymentCardData.spaceId),
    StartYear: "",
    StartMonth: "",
    Type: getPaymentTypeFromCardNumber(cardNumber),
    UserModificationDatetime: paymentCardCreationDate,
    LastBackupTime: 0,
  };
  return paymentCard;
}
const addPaymentCard = async (
  { storeService, sessionService, eventLoggerService }: CoreServices,
  newPaymentCardData: AddPaymentCardRequest
) => {
  if (!storeService.isAuthenticated()) {
    throw new Error("No session available to addPaymentCard");
  }
  const paymentCardToSave = getNewPaymentCard(newPaymentCardData);
  if (!paymentCardToSave.SpaceId) {
    const defaultSpaceId = await getDefaultSpaceId(storeService);
    paymentCardToSave.SpaceId = defaultSpaceId;
  }
  logAddVaultItem(storeService, eventLoggerService, paymentCardToSave);
  storeService.dispatch(
    savePersonalDataItem(paymentCardToSave, paymentCardToSave.kwType)
  );
  sessionService.getInstance().user.persistPersonalData();
};
export const addPaymentCardHandler = async (
  services: CoreServices,
  paymentCardData: AddPaymentCardRequest
): Promise<PaymentCardSaveResult> => {
  try {
    await addPaymentCard(services, paymentCardData);
    const debounceSync = getDebounceSync(
      services.storeService,
      services.sessionService
    );
    debounceSync({ immediateCall: true }, Trigger.Save);
    return Promise.resolve({
      success: true,
    });
  } catch (error) {
    sendExceptionLog({
      error,
    });
    if (error instanceof RequestError && error.code !== undefined) {
      return Promise.resolve({
        success: false,
        error: {
          code: error.code as PaymentCardSaveResultErrorCode,
        },
      });
    }
    return Promise.resolve({ success: false });
  }
};
