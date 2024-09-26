import { defaultTo } from "ramda";
import {
  Country,
  type DataModelObject,
  type PaymentCard,
  PaymentCardColor,
  type SavePaymentCardEvent,
} from "@dashlane/communication";
import Debugger from "Logs/Debugger";
import { savePaymentCard as actionSavePaymentCard } from "Session/Store/personalData/actions";
import { generateItemUuid } from "Utils/generateItemUuid";
import { getUnixTimestamp } from "Utils/getUnixTimestamp";
import { StoreService } from "Store/";
import { SessionService } from "User/Services/types";
import { findDataModelObject } from "DataManagement/PersonalData/utils";
import {
  defaultToEmptyString,
  getLastDigitsFromCardNumber,
  getPaymentTypeFromCardNumber,
} from "DataManagement/PaymentCards/helpers";
import {
  logAddVaultItem,
  logEditVaultItem,
} from "DataManagement/PersonalData/logs";
import { EventLoggerService } from "Logs/EventLogger";
interface SavePaymentCardServices {
  storeService: StoreService;
  sessionService: SessionService;
  eventLoggerService: EventLoggerService;
}
export interface PaymentCardDataToSave extends SavePaymentCardEvent {
  from: string;
}
export function savePaymentCard(
  { storeService, sessionService, eventLoggerService }: SavePaymentCardServices,
  newPaymentCardData: SavePaymentCardEvent
): void {
  if (!storeService.isAuthenticated()) {
    Debugger.log("No session available to savePaymentCard");
    return;
  }
  const personalData = storeService.getPersonalData();
  const paymentCardToSave = newPaymentCardData.id
    ? getUpdatedPaymentCard(personalData.paymentCards, newPaymentCardData)
    : getNewPaymentCard(newPaymentCardData);
  if (newPaymentCardData.id) {
    const storedItem = findDataModelObject<DataModelObject>(
      paymentCardToSave.Id,
      personalData.paymentCards
    );
    logEditVaultItem(
      storeService,
      eventLoggerService,
      paymentCardToSave,
      storedItem
    );
  } else {
    logAddVaultItem(storeService, eventLoggerService, paymentCardToSave);
  }
  storeService.dispatch(actionSavePaymentCard(paymentCardToSave));
  sessionService.getInstance().user.persistPersonalData();
}
export function getNewPaymentCard(
  newPaymentCardData: SavePaymentCardEvent
): PaymentCard {
  Debugger.log("[Data] Creating new Payment Card");
  const paymentCardCreationDate = getUnixTimestamp();
  const cardNumber = defaultToEmptyString(
    newPaymentCardData.cardNumber
  ).replace(/ /g, "");
  const paymentCard: PaymentCard = {
    kwType: "KWPaymentMean_creditCard",
    Bank: "US-NO_TYPE",
    CardNumber: cardNumber,
    CardNumberLastDigits: getLastDigitsFromCardNumber(cardNumber),
    CreationDatetime: paymentCardCreationDate,
    Color: defaultTo(PaymentCardColor.BLUE_1, newPaymentCardData.color),
    ExpireMonth: defaultToEmptyString(newPaymentCardData.expireMonth),
    ExpireYear: defaultToEmptyString(newPaymentCardData.expireYear),
    Id: generateItemUuid(),
    IssueNumber: "",
    Name: defaultTo("Card", newPaymentCardData.cardName),
    OwnerName: defaultToEmptyString(newPaymentCardData.ownerName),
    CCNote: defaultToEmptyString(newPaymentCardData.personalNote),
    LocaleFormat: Country.US,
    SecurityCode: defaultToEmptyString(newPaymentCardData.securityCode),
    SpaceId: newPaymentCardData.spaceId || "",
    StartYear: "",
    StartMonth: "",
    Type: getPaymentTypeFromCardNumber(cardNumber),
    UserModificationDatetime: paymentCardCreationDate,
    LastBackupTime: 0,
  };
  return paymentCard;
}
export function getUpdatedPaymentCard(
  paymentCards: PaymentCard[],
  newPaymentCardData: SavePaymentCardEvent
): PaymentCard {
  const paymentCard = findDataModelObject(newPaymentCardData.id, paymentCards);
  if (!paymentCard) {
    Debugger.log("Client asks to update an unknown Payment Card");
    return undefined;
  }
  Debugger.log(
    `[Data] Updating existing Payment Card ${newPaymentCardData.id}`
  );
  const paymentCardModificationDate = getUnixTimestamp();
  const cardNumber = defaultToEmptyString(
    newPaymentCardData.cardNumber
  ).replace(/ /g, "");
  const updatedPaymentCardProperties: Partial<PaymentCard> = {
    CardNumber: cardNumber,
    CardNumberLastDigits: getLastDigitsFromCardNumber(cardNumber),
    Color: newPaymentCardData.color
      ? newPaymentCardData.color
      : paymentCard.Color,
    ExpireMonth: defaultToEmptyString(newPaymentCardData.expireMonth),
    ExpireYear: defaultToEmptyString(newPaymentCardData.expireYear),
    Name: defaultTo("Card", newPaymentCardData.cardName),
    OwnerName: defaultToEmptyString(newPaymentCardData.ownerName),
    SecurityCode: defaultToEmptyString(newPaymentCardData.securityCode),
    SpaceId: defaultToEmptyString(newPaymentCardData.spaceId),
    Type: getPaymentTypeFromCardNumber(newPaymentCardData.cardNumber),
    UserModificationDatetime: paymentCardModificationDate,
    CCNote: defaultToEmptyString(newPaymentCardData.personalNote),
  };
  return { ...paymentCard, ...updatedPaymentCardProperties };
}
