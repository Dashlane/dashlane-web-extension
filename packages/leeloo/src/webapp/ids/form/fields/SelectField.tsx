import * as React from 'react';
import { Field, FieldProps } from 'formik';
import Select from 'libs/dashlane-style/select-field/detail';
import { TranslateFunction } from 'libs/i18n/types';
import { I18N_KEYS_COMMON } from 'webapp/ids/form/common-fields-translations';
export const getDefaultOption = (translate: TranslateFunction, value = '') => {
    return {
        label: translate(I18N_KEYS_COMMON.GENERIC_SELECT_PLACEHOLDER),
        value,
    };
};
interface Props {
    name: string;
    label: string;
    placeholder: string;
    options: {
        label: string;
        value: string;
    }[];
    defaultOption: {
        label: string;
        value: string;
    };
    disabled?: boolean;
}
export const SelectField = ({ name, label, placeholder, options, defaultOption, disabled = false, }: Props) => {
    return (<Field name={name}>
      {({ field }: FieldProps) => (<Select label={label} placeholder={placeholder} options={options} defaultOption={defaultOption} disabled={disabled} {...field}/>)}
    </Field>);
};
