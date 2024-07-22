import { PaymentCard as CarbonPaymentCard } from "@dashlane/communication";
import { PaymentCard, PaymentCardColorType } from "@dashlane/vault-contracts";
import { mapKeysToLowercase } from "../utility";
const PaymentCardColorTypeDictionary = {
  BLACK: PaymentCardColorType.Black,
  BLUE_1: PaymentCardColorType.Blue1,
  BLUE_2: PaymentCardColorType.Blue2,
  GOLD: PaymentCardColorType.Gold,
  GREEN_1: PaymentCardColorType.Green1,
  GREEN_2: PaymentCardColorType.Green2,
  ORANGE: PaymentCardColorType.Orange,
  RED: PaymentCardColorType.Red,
  SILVER: PaymentCardColorType.Silver,
  WHITE: PaymentCardColorType.White,
};
export const paymentCardMapper = (
  carbonPaymentCard: CarbonPaymentCard
): PaymentCard => {
  const {
    Name,
    CCNote,
    Color,
    Bank,
    CardNumberLastDigits,
    IssueNumber,
    StartMonth,
    StartYear,
    Type,
    LocaleFormat,
    ...rest
  } = carbonPaymentCard;
  return {
    ...mapKeysToLowercase(rest),
    itemName: Name,
    color: PaymentCardColorTypeDictionary[Color],
    note: CCNote || "",
  };
};
