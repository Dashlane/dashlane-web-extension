import { parse as dateParser } from 'date-fns';
import { Country, Identity, Phone, PhoneType, VaultItemType, } from '@dashlane/vault-contracts';
import { TranslateFunction, TranslatorInterface } from 'libs/i18n/types';
import { LocaleFormat } from 'libs/i18n/helpers';
import { PersonalInfoItemType } from './types';
const I18N_KEYS = {
    FAX: 'personal_info_phone_type_fax',
    LANDLINE: 'personal_info_phone_type_landline',
    MOBILE: 'personal_info_phone_type_mobile',
    WORK_FAX: 'personal_info_phone_type_work_fax',
    WORK_LANDLINE: 'personal_info_phone_type_work_landline',
    WORK_MOBILE: 'personal_info_phone_type_work_mobile',
    DEFAULT_PHONE: 'personal_info_phone_type_any',
    PHONE_NAME: 'personal_info_phone_name',
};
const NEW_PERSONAL_INFO_NAME_I18N_KEYS_DICTIONARY: Record<PersonalInfoItemType, string> = {
    [VaultItemType.Address]: 'webapp_personal_info_edition_header_address_new_item_title',
    [VaultItemType.Company]: 'webapp_personal_info_edition_header_company_new_item_title',
    [VaultItemType.Email]: 'webapp_personal_info_edition_header_email_new_item_title',
    [VaultItemType.Identity]: 'webapp_personal_info_edition_header_identity_new_item_title',
    [VaultItemType.Phone]: 'webapp_personal_info_edition_header_phone_new_item_title',
    [VaultItemType.Website]: 'webapp_personal_info_edition_header_website_new_item_title',
};
export function getNewPersonalInfoName(translateFn: TranslateFunction, personalInfoItemType: PersonalInfoItemType): string {
    return translateFn(NEW_PERSONAL_INFO_NAME_I18N_KEYS_DICTIONARY[personalInfoItemType]);
}
function getPhoneItemType(translateFn: TranslateFunction, phoneType: PhoneType): string {
    switch (phoneType) {
        case PhoneType.Fax:
            return translateFn(I18N_KEYS.FAX);
        case PhoneType.Landline:
            return translateFn(I18N_KEYS.LANDLINE);
        case PhoneType.Mobile:
            return translateFn(I18N_KEYS.MOBILE);
        case PhoneType.WorkFax:
            return translateFn(I18N_KEYS.WORK_FAX);
        case PhoneType.WorkLandline:
            return translateFn(I18N_KEYS.WORK_LANDLINE);
        case PhoneType.WorkMobile:
            return translateFn(I18N_KEYS.WORK_MOBILE);
        default:
            return translateFn(I18N_KEYS.DEFAULT_PHONE);
    }
}
export function getPhoneItemName(item: Phone, translateFn: TranslateFunction): string {
    return translateFn(I18N_KEYS.PHONE_NAME, {
        phoneNumberName: item.itemName,
        phoneType: getPhoneItemType(translateFn, item.type),
    });
}
export function getIdentityItemFullName(item: Pick<Identity, 'firstName' | 'middleName' | 'lastName' | 'lastName2' | 'pseudo'>): string {
    const { firstName, middleName, lastName, lastName2, pseudo } = item;
    const fields = [firstName, middleName, lastName, lastName2];
    let name = fields.filter((namePart) => !!namePart).join(' ');
    if (pseudo) {
        name += name.length > 0 ? ` (${item.pseudo})` : `(${item.pseudo})`;
    }
    return name;
}
export function parseDate(date: string): Date {
    if (!date) {
        return new Date();
    }
    const birthDateParsed = dateParser(date, 'yyyy-MM-dd', new Date());
    return birthDateParsed.toString() !== 'Invalid Date'
        ? birthDateParsed
        : new Date(date);
}
export function getViewedIdentitySecondLine(birthDateString: string, birthPlace: string, translator: TranslatorInterface): string {
    if (birthDateString === '') {
        return '';
    }
    const birthDate = parseDate(birthDateString);
    const formattedBirthDate = translator.shortDate(birthDate, LocaleFormat.LL);
    if (birthDate && birthPlace) {
        return `${formattedBirthDate}, ${birthPlace}`;
    }
    return formattedBirthDate;
}
export function getViewedAddressSecondLine(city: string, country: Country, streetName: string, zipCode: string, translator: TranslatorInterface): string {
    return [
        streetName ? streetName.split('\n')[0] : '',
        zipCode,
        city,
        translator(`country_name_${country.toUpperCase()}`),
    ]
        .filter((addressPart) => !!addressPart)
        .join(', ');
}
export function getTranslatedAddressCountry(translateFn: TranslateFunction, localeFormat: Country): string {
    return translateFn(`country_name_${Country[localeFormat]}`);
}
