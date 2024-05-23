import { Country } from '@dashlane/communication';
import { CountryZone, getCountryZone } from 'libs/countryHelper';
export enum Field {
    TITLE,
    FIRSTNAME,
    MIDDLENAME,
    LASTNAME,
    LASTNAME2,
    PSEUDO,
    BIRTHDATE,
    BIRTHPLACE
}
export const isTitleFieldVisible = (countryZone: CountryZone): boolean => {
    return countryZone !== CountryZone.JAPAN;
};
export const isMiddleNameFieldVisible = (countryZone: CountryZone): boolean => {
    return countryZone === CountryZone.NORTH_AMERICA_AND_ASIA;
};
export const isLastName2FieldVisible = (countryZone: CountryZone): boolean => {
    return countryZone === CountryZone.SPANISH;
};
export const isFieldVisible = (country: Country) => {
    const countryZone = getCountryZone(country);
    const fieldVisibility = {
        [Field.TITLE]: isTitleFieldVisible(countryZone),
        [Field.FIRSTNAME]: true,
        [Field.MIDDLENAME]: isMiddleNameFieldVisible(countryZone),
        [Field.LASTNAME]: true,
        [Field.LASTNAME2]: isLastName2FieldVisible(countryZone),
        [Field.PSEUDO]: true,
        [Field.BIRTHDATE]: true,
        [Field.BIRTHPLACE]: true,
    };
    return (field: Field, fieldValue: string) => {
        return fieldVisibility[field] || !!fieldValue;
    };
};
