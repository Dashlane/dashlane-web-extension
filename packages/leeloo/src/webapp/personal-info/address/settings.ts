import { Address, Country } from '@dashlane/vault-contracts';
import { Enum } from 'typescript-string-enums';
export enum LocaleZone {
    DEFAULT,
    WITHSTATE,
    NORTHAMERICA,
    UNITEDKINGDOM,
    ASIA,
    JAPAN
}
const localeZoneWithState = new Set<Country>([
    Country.AR,
    Country.BE,
    Country.CH,
    Country.CL,
    Country.CO,
    Country.DE,
    Country.ES,
    Country.IT,
    Country.NL,
    Country.NO,
    Country.PE,
    Country.PT,
    Country.SE,
    Country.MX,
]);
const localeZoneNorthAmerica = new Set<Country>([
    Country.AU,
    Country.CA,
    Country.US,
]);
const localeZoneUnitedKingdom = new Set<Country>([Country.GB, Country.IE]);
const localeZoneAsia = new Set<Country>([
    Country.CN,
    Country.IN,
    Country.KR,
    Country.BR,
]);
const localeZoneJapan = new Set<Country>([Country.JP]);
export const LocalizedAddressField = Enum<keyof Address>('streetName', 'city', 'state', 'country', 'streetNumber', 'zipCode');
export type LocalizedAddressField = Enum<typeof LocalizedAddressField>;
export const getLocaleZone = (localeFormat: Country): LocaleZone => {
    if (localeZoneWithState.has(localeFormat)) {
        return LocaleZone.WITHSTATE;
    }
    else if (localeZoneNorthAmerica.has(localeFormat)) {
        return LocaleZone.NORTHAMERICA;
    }
    else if (localeZoneUnitedKingdom.has(localeFormat)) {
        return LocaleZone.UNITEDKINGDOM;
    }
    else if (localeZoneAsia.has(localeFormat)) {
        return LocaleZone.ASIA;
    }
    else if (localeZoneJapan.has(localeFormat)) {
        return LocaleZone.JAPAN;
    }
    return LocaleZone.DEFAULT;
};
export const getLocalizedAddressFields = (localeFormat: Country): LocalizedAddressField[] => {
    const localeZone = getLocaleZone(localeFormat);
    if (localeZone === LocaleZone.NORTHAMERICA) {
        return [
            LocalizedAddressField.streetName,
            LocalizedAddressField.city,
            LocalizedAddressField.state,
            LocalizedAddressField.zipCode,
            LocalizedAddressField.country,
        ];
    }
    else if (localeZone === LocaleZone.UNITEDKINGDOM) {
        return [
            LocalizedAddressField.streetNumber,
            LocalizedAddressField.streetName,
            LocalizedAddressField.city,
            LocalizedAddressField.state,
            LocalizedAddressField.zipCode,
            LocalizedAddressField.country,
        ];
    }
    else if (localeZone === LocaleZone.ASIA) {
        return [
            LocalizedAddressField.streetName,
            LocalizedAddressField.city,
            LocalizedAddressField.zipCode,
            LocalizedAddressField.country,
        ];
    }
    else if (localeZone === LocaleZone.JAPAN) {
        return [
            LocalizedAddressField.zipCode,
            LocalizedAddressField.city,
            LocalizedAddressField.streetName,
            LocalizedAddressField.country,
        ];
    }
    else if (localeZone === LocaleZone.WITHSTATE) {
        return [
            LocalizedAddressField.streetName,
            LocalizedAddressField.zipCode,
            LocalizedAddressField.city,
            LocalizedAddressField.state,
            LocalizedAddressField.country,
        ];
    }
    return [
        LocalizedAddressField.streetName,
        LocalizedAddressField.zipCode,
        LocalizedAddressField.city,
        LocalizedAddressField.country,
    ];
};
