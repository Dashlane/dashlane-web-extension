import * as React from 'react';
import { Field, FieldProps } from 'formik';
import DetailField from 'libs/dashlane-style/detail-field';
interface Props {
    name: string;
    label: string;
    placeholder: string;
    disabled?: boolean;
}
const TextInputFieldComponent = ({ name, label, placeholder, disabled }: Props, ref: React.Ref<DetailField>) => {
    return (<Field name={name}>
      {({ field, meta }: FieldProps) => (<DetailField key={field.name} label={label} placeholder={placeholder} disabled={disabled} {...field} value={field.value} error={meta.error !== undefined} ref={ref}/>)}
    </Field>);
};
const TextInputFieldRef = React.forwardRef<DetailField, Props>(TextInputFieldComponent);
export const TextInputField = React.memo(TextInputFieldRef);
