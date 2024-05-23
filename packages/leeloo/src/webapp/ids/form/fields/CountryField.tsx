import React from 'react';
import { useFormikContext } from 'formik';
import { BaseIdUpdateModel, Country } from '@dashlane/communication';
import useTranslate from 'libs/i18n/useTranslate';
import { TranslateFunction } from 'libs/i18n/types';
import { getDefaultOption, SelectField } from './SelectField';
const countryList = Object.keys(Country);
const getCountryOptions = (translate: TranslateFunction) => {
    const sorted = countryList
        .filter((countryKey) => !(Country[countryKey] === Country.UNIVERSAL ||
        Country[countryKey] === Country.NO_TYPE))
        .map((countryKey) => ({
        label: translate(`country_name_${Country[countryKey]}`),
        value: Country[countryKey],
    }))
        .sort((a, b) => a.label.localeCompare(b.label));
    return [getDefaultOption(translate, Country.UNIVERSAL), ...sorted];
};
interface Props {
    name: string;
    label: string;
    disabled?: boolean;
}
const CountryFieldComponent = ({ name, label, disabled = false }: Props) => {
    const { translate } = useTranslate();
    const { values } = useFormikContext<BaseIdUpdateModel>();
    const { current: options } = React.useRef(getCountryOptions(translate));
    const defaultOption = options[0];
    const currentValue = values[name];
    const currentOption = options?.find(({ value }) => value === currentValue) ??
        (currentValue &&
            currentValue !== Country.UNIVERSAL &&
            currentValue !== Country.NO_TYPE
            ?
                { label: currentValue, value: currentValue }
            : defaultOption);
    return (<SelectField name={name} label={label} placeholder={defaultOption.value} options={options} defaultOption={currentOption} disabled={disabled}/>);
};
export const CountryField = React.memo(CountryFieldComponent);
