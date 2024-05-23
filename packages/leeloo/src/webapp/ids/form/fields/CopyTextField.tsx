import React from 'react';
import { useFormikContext } from 'formik';
import { IdCardUpdateModel } from '@dashlane/communication';
import DetailField from 'libs/dashlane-style/detail-field';
import { CopyToClipboardButton } from 'webapp/credentials/edit/copy-to-clipboard-control';
import { FieldButtonsWrapper } from './FieldButtonsWrapper';
import { TextInputField } from './TextInputField';
interface Props {
    name: string;
    label: string;
    placeholder: string;
    disabled?: boolean;
    handleCopy?: (success: boolean, error: Error | undefined) => void;
}
export const CopyTextFieldComponent = ({ name, label, placeholder, disabled = false, handleCopy }: Props, ref: React.Ref<DetailField>) => {
    const { values } = useFormikContext<IdCardUpdateModel>();
    return (<FieldButtonsWrapper showButtonsOnHover={!!values[name]} buttons={handleCopy ? (<CopyToClipboardButton data={values[name]} onCopy={handleCopy}/>) : null}>
      <TextInputField name={name} label={label} placeholder={placeholder} ref={ref} disabled={disabled}/>
    </FieldButtonsWrapper>);
};
export const CopyTextField = React.memo(React.forwardRef<DetailField, Props>(CopyTextFieldComponent));
