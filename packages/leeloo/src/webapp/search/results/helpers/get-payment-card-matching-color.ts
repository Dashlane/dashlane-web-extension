import { DecorativeContainerColor } from "@dashlane/design-system";
import { PaymentCardColorType } from "@dashlane/vault-contracts";
export const getPaymentCardMatchingColor = (
  color: PaymentCardColorType
): DecorativeContainerColor => {
  switch (color) {
    case PaymentCardColorType.Blue1:
    case PaymentCardColorType.Blue2:
      return "blue";
    case PaymentCardColorType.Gold:
      return "yellow";
    case PaymentCardColorType.Green1:
    case PaymentCardColorType.Green2:
      return "green";
    case PaymentCardColorType.Orange:
      return "orange";
    case PaymentCardColorType.Red:
      return "red";
    case PaymentCardColorType.Black:
      return "black";
    default:
      return "grey";
  }
};
