import { PaymentCardFormFields } from "./payment-card-form";
type ValidationReturn =
  | {
      isValid: false;
      errorSet: Set<keyof PaymentCardFormFields>;
    }
  | {
      isValid: true;
    };
export const validatePaymentCardForm = (
  paymentCardContent: PaymentCardFormFields
): ValidationReturn => {
  const errorSet = new Set<keyof PaymentCardFormFields>();
  if (
    !paymentCardContent.cardNumber ||
    paymentCardContent.cardNumber.length === 0
  ) {
    errorSet.add("cardNumber");
  }
  if (errorSet.size > 0) {
    return {
      isValid: false,
      errorSet: errorSet,
    };
  }
  return { isValid: true };
};
