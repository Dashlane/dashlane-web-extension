import {
  VaultAutofillViewInterfaces,
  VaultSourceType,
} from "@dashlane/autofill-contracts";
import { AutofillEngineContext } from "../../../Api/server/context";
import { WebcardItemProperties } from "../../../Api/types/webcards/webcard-item";
import { VaultIngredient } from "../../../Api/types/autofill";
import { CapturedValuesAndProperties } from "../../modules/dataCapture/personal-data-capture-helpers";
import { getValueToFillFromVaultItem } from "../../modules/autofill/apply-autofill-recipe-handler";
import { getFormattedLastDigits } from "./formatters/PaymentCard/helpers";
const CARDS_EXPIRATION_WARNING_DELAY: Partial<Record<VaultSourceType, number>> =
  {
    [VaultSourceType.PaymentCard]: 3,
    [VaultSourceType.IdCard]: 6,
    [VaultSourceType.Passport]: 6,
    [VaultSourceType.DriverLicense]: 6,
  };
export const epochToDateStr = (epoch: number): string => {
  const date = new Date(epoch * 1000);
  return `${date.getUTCFullYear()}-${
    date.getUTCMonth() + 1
  }-${date.getUTCDate()}`;
};
export const findCapturedDataByProperty = (
  capturedData: CapturedValuesAndProperties<VaultSourceType>,
  property: VaultIngredient["property"]
) => capturedData.find((capturedField) => capturedField.property === property);
export const getExpirationWarningsForEnhancedWebcardItems = (
  expirationMonth: number,
  expirationYear: number,
  itemType: VaultSourceType
): {
  aboutToExpire: boolean;
  expired: boolean;
} => {
  const expirationDate = new Date(expirationYear, expirationMonth, 1);
  const nearingExpirationDate = new Date(
    expirationYear,
    expirationMonth - (CARDS_EXPIRATION_WARNING_DELAY[itemType] ?? 6),
    1
  );
  const expired = new Date() >= expirationDate;
  const aboutToExpire = new Date() >= nearingExpirationDate;
  return { expired, aboutToExpire };
};
const getDisplayableValueForProperty = (
  property: VaultIngredient["property"],
  value?: string
) => {
  switch (property) {
    case "password":
      return "••••••••••••";
    case "otpSecret":
      return "••• •••";
    case "securityCode":
      return "•••";
    case "cardNumber":
      return getFormattedLastDigits(value?.slice(-4) ?? "", "long");
    case "BIC":
      return "••••••";
    case "IBAN":
    case "idNumber":
      return "••••••••••••••••";
    default:
      return value ?? "••••";
  }
};
export const buildItemProperties = async <T extends VaultSourceType>(
  context: AutofillEngineContext,
  vaultType: T,
  vaultItem: VaultAutofillViewInterfaces[T],
  properties: (keyof VaultAutofillViewInterfaces[T])[]
): Promise<WebcardItemProperties<T>> => {
  const itemProperties: WebcardItemProperties<T> = {};
  await Promise.all(
    properties.map(async (property) => {
      const value = await getValueToFillFromVaultItem(context, {
        ingredient: {
          type: vaultType,
          property: property as any,
        },
        vaultItem,
      });
      if (value) {
        itemProperties[property] = getDisplayableValueForProperty(
          property as VaultIngredient["property"],
          value
        );
      }
    })
  );
  return itemProperties;
};
