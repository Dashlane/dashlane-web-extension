import { PaymentCardFormFields } from './payment-card-form';
type ValidationReturn = {
    isValid: false;
    errorSet: Set<keyof PaymentCardFormFields>;
} | {
    isValid: true;
};
export const validatePaymentCardForm = (paymentCardContent: PaymentCardFormFields): ValidationReturn => {
    if (!paymentCardContent.cardNumber && !paymentCardContent.securityCode) {
        return {
            isValid: false,
            errorSet: new Set(['cardNumber', 'securityCode']),
        };
    }
    return { isValid: true };
};
