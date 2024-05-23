import { CallingCodeCollection } from '@dashlane/communication';
import { Country, PhoneType } from '@dashlane/vault-contracts';
import { TranslatorInterface } from 'libs/i18n/types';
import { CallingCodeOption, PhoneTypeOption } from './form';
export function getCallingCodeOption(translate: TranslatorInterface, callingCodes: CallingCodeCollection) {
    const _CountryName = translate.namespace('country_name_');
    return (localeFormat: Country): CallingCodeOption => {
        localeFormat = localeFormat || Country.US;
        return {
            label: `${_CountryName(Country[localeFormat])} (+${callingCodes[localeFormat]})`,
            selectedLabel: `${localeFormat} (+${callingCodes[localeFormat]})`,
            value: localeFormat,
        };
    };
}
export function getCountryCallingCodeOptions(translate: TranslatorInterface, callingCodes: CallingCodeCollection): CallingCodeOption[] {
    const getOption = getCallingCodeOption(translate, callingCodes);
    return Object.keys(callingCodes).map((localeFormat) => getOption(Country[localeFormat]));
}
export function getPhoneTypeOptions(translate: TranslatorInterface): PhoneTypeOption[] {
    const _PersonalInfo = translate.namespace('personal_info_');
    return [
        {
            label: _PersonalInfo('phone_type_mobile'),
            value: PhoneType.Mobile,
        },
        {
            label: _PersonalInfo('phone_type_landline'),
            value: PhoneType.Landline,
        },
        {
            label: _PersonalInfo('phone_type_work_mobile'),
            value: PhoneType.WorkMobile,
        },
        {
            label: _PersonalInfo('phone_type_work_landline'),
            value: PhoneType.WorkLandline,
        },
        {
            label: _PersonalInfo('phone_type_fax'),
            value: PhoneType.Fax,
        },
        {
            label: _PersonalInfo('phone_type_work_fax'),
            value: PhoneType.WorkFax,
        },
        {
            label: _PersonalInfo('phone_type_any'),
            value: PhoneType.Any,
        },
    ];
}
