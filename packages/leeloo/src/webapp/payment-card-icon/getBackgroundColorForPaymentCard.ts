import { PaymentCardColorType } from "@dashlane/vault-contracts";
const CARD_COLORS: {
  [k in PaymentCardColorType | "fallback"]: string;
} = {
  fallback: "#000000",
  [PaymentCardColorType.Black]: "#191919",
  [PaymentCardColorType.Silver]: "#A6A6A6",
  [PaymentCardColorType.White]: "#F5F5F5",
  [PaymentCardColorType.Red]: "#BD0505",
  [PaymentCardColorType.Orange]: "#F29100",
  [PaymentCardColorType.Gold]: "#DFC279",
  [PaymentCardColorType.Blue1]: "#3290CC",
  [PaymentCardColorType.Blue2]: "#105079",
  [PaymentCardColorType.Green1]: "#008E28",
  [PaymentCardColorType.Green2]: "#39725E",
};
const getBackgroundColor = (
  paymentCardColor: PaymentCardColorType | "fallback" = "fallback"
) => CARD_COLORS[paymentCardColor];
export default getBackgroundColor;
