import React from 'react';
import { useFormikContext } from 'formik';
import { IdCardUpdateModel } from '@dashlane/communication';
import { CopyTextField } from './CopyTextField';
interface Props {
    name: string;
    label: string;
    placeholder: string;
    disabled?: boolean;
    handleCopy?: (success: boolean, error: Error | undefined) => void;
}
const TeledeclarantNumberFieldComponent = ({ name, label, placeholder, disabled = false, handleCopy, }: Props) => {
    const { setFieldValue, values } = useFormikContext<IdCardUpdateModel>();
    React.useEffect(() => {
        if (values.country !== 'FR') {
            setFieldValue(name, '');
        }
    }, [name, setFieldValue, values.country]);
    if (values.country !== 'FR') {
        return null;
    }
    return (<CopyTextField name={name} label={label} placeholder={placeholder} handleCopy={handleCopy} disabled={disabled}/>);
};
export const TeledeclarantNumberField = React.memo(TeledeclarantNumberFieldComponent);
