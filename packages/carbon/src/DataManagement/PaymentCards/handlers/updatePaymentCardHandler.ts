import { Trigger } from "@dashlane/hermes";
import {
  PaymentCard,
  PaymentCardSaveResult,
  PaymentCardSaveResultErrorCode,
  UpdatePaymentCardRequest,
} from "@dashlane/communication";
import { paymentCardSelector } from "DataManagement/PaymentCards/selectors";
import { getDebounceSync } from "DataManagement/utils";
import {
  defaultToEmptyString,
  getLastDigitsFromCardNumber,
  getPaymentTypeFromCardNumber,
  RequestError,
} from "DataManagement/PaymentCards/helpers";
import { CoreServices } from "Services";
import { savePersonalDataItem } from "Session/Store/actions";
import { getUnixTimestamp } from "Utils/getUnixTimestamp";
import { sendExceptionLog } from "Logs/Exception";
import { sanitizeInputPersonalData } from "DataManagement/PersonalData/sanitize";
import { logEditVaultItem } from "DataManagement/PersonalData/logs";
export function getUpdatedPaymentCard(
  existingPaymentCard: PaymentCard,
  updatedPaymentCardData: UpdatePaymentCardRequest
): PaymentCard {
  if (!existingPaymentCard) {
    throw new RequestError(
      "[updatePaymentCard]: unable to find payment card to update.",
      PaymentCardSaveResultErrorCode.NOT_FOUND
    );
  }
  updatedPaymentCardData = sanitizeInputPersonalData(updatedPaymentCardData);
  const cardNumber = defaultToEmptyString(
    updatedPaymentCardData.cardNumber ?? existingPaymentCard.CardNumber
  ).replace(/ /g, "");
  const paymentCardModificationDate = getUnixTimestamp();
  const updatedPaymentCardProperties: Partial<PaymentCard> = {
    CardNumber: cardNumber,
    CardNumberLastDigits: getLastDigitsFromCardNumber(cardNumber),
    Color: updatedPaymentCardData.color ?? existingPaymentCard.Color,
    ExpireMonth:
      updatedPaymentCardData.expireMonth ?? existingPaymentCard.ExpireMonth,
    ExpireYear:
      updatedPaymentCardData.expireYear ?? existingPaymentCard.ExpireYear,
    Name: updatedPaymentCardData.name ?? existingPaymentCard.Name,
    OwnerName:
      updatedPaymentCardData.ownerName ?? existingPaymentCard.OwnerName,
    SecurityCode:
      updatedPaymentCardData.securityCode ?? existingPaymentCard.SecurityCode,
    SpaceId: updatedPaymentCardData.spaceId ?? existingPaymentCard.SpaceId,
    Type: getPaymentTypeFromCardNumber(cardNumber),
    UserModificationDatetime: paymentCardModificationDate,
    CCNote: updatedPaymentCardData.personalNote ?? existingPaymentCard.CCNote,
  };
  const updatedPaymentCard = {
    ...existingPaymentCard,
    ...updatedPaymentCardProperties,
  };
  if (!cardNumber && !updatedPaymentCard.SecurityCode) {
    throw new RequestError(
      "[updatePaymentCard]: refusing to add a payment card without card number or security code.",
      PaymentCardSaveResultErrorCode.EMPTY_CARD_NUMBER_AND_SECURITY_CODE
    );
  }
  return updatedPaymentCard;
}
function updatePaymentCard(
  { storeService, sessionService, eventLoggerService }: CoreServices,
  updatedPaymentCardData: UpdatePaymentCardRequest
) {
  if (!storeService.isAuthenticated()) {
    throw new Error("No session available to updatePaymentCard");
  }
  const existingPaymentCard = paymentCardSelector(
    storeService.getState(),
    updatedPaymentCardData.id
  );
  const paymentCardToSave = getUpdatedPaymentCard(
    existingPaymentCard,
    updatedPaymentCardData
  );
  logEditVaultItem(
    storeService,
    eventLoggerService,
    paymentCardToSave,
    existingPaymentCard
  );
  storeService.dispatch(
    savePersonalDataItem(paymentCardToSave, paymentCardToSave.kwType)
  );
  sessionService.getInstance().user.persistPersonalData();
}
export function updatePaymentCardHandler(
  services: CoreServices,
  paymentCardData: UpdatePaymentCardRequest
): Promise<PaymentCardSaveResult> {
  try {
    updatePaymentCard(services, paymentCardData);
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
}
