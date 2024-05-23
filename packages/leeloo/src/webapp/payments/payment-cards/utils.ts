const getLast4Digits = (cardNumber: string): string => {
    return cardNumber ? cardNumber.trim().slice(-4) : '';
};
export const getDisplayedCardNumber = (cardNumber: string): string => {
    const lastDigits = (cardNumber ? getLast4Digits(cardNumber) : '') || '••••';
    return `•••• •••• •••• ${lastDigits}`;
};
export const getExpirationDate = (expireMonth: string, expireYear: string): string => {
    return expireMonth && expireYear
        ? `${expireMonth}/${expireYear.substring(2)}`
        : '';
};
