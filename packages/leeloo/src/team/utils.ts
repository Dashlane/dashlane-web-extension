export const roundToFirstDecimalOrInt = (num: number) => {
    const numToOneDecimalPlace = num.toFixed(1);
    const numToInt = num.toFixed();
    return parseFloat(numToInt) - parseFloat(numToOneDecimalPlace) === 0
        ? numToInt
        : numToOneDecimalPlace;
};
