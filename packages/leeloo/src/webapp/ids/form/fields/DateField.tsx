import React from 'react';
import { Field, FieldProps, useFormikContext } from 'formik';
import useTranslate from 'libs/i18n/useTranslate';
import { LocaleFormat } from 'libs/i18n/helpers';
import { DateFieldSelect } from 'libs/dashlane-style/date-field/select';
interface Props {
    name: string;
    label: string;
    disabled?: boolean;
}
const DateFieldComponent = ({ name, label, disabled }: Props) => {
    const { translate } = useTranslate();
    const { setFieldValue } = useFormikContext();
    const handleChange = (value: string) => setFieldValue(name, value === '' ? null : value);
    return (<Field name={name}>
      {({ field }: FieldProps) => (<DateFieldSelect value={`${field.value ?? ''}`} label={label} dateFormat="yyyy-MM-dd" onChange={handleChange} monthLabelFormatter={(value) => translate.shortDate(value, LocaleFormat.M)} yearsRange={[-100, 100]} allowEmpty disabled={disabled}/>)}
    </Field>);
};
export const DateField = React.memo(DateFieldComponent);
