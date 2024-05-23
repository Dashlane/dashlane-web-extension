import { useState } from 'react';
import { CheckCircleIcon, colors, LoadingIcon } from '@dashlane/ui-components';
import { jsx } from '@dashlane/design-system';
import { OptionField, SelectField, } from 'libs/dashlane-style/select-field/material';
import { transformUnknownErrorToErrorMessage } from 'helpers';
import styles from './styles.css';
const { accessibleValidatorGreen } = colors;
interface Props {
    value: string;
    isDisabled?: boolean;
    onSelectElementClick?: () => void;
    options: {
        label: string;
        value: string;
        disabled?: boolean;
    }[];
    saveValueFunction: (value: string) => Promise<void>;
    successMessage: string;
    savingMessage: string;
}
export const SelectWithFeedback = ({ value, isDisabled, onSelectElementClick, options, saveValueFunction, successMessage, savingMessage, }: Props) => {
    const [errorMessage, setErrorMessage] = useState<string>('');
    const [isSavingField, setIsSavingField] = useState(false);
    const [showSaveFieldFeedbackMessage, setShowSaveFieldFeedbackMessage] = useState(false);
    const handleSelectValue = (_event: React.FormEvent<HTMLInputElement>, _index: number, value: string) => {
        setIsSavingField(true);
        saveValueFunction(value)
            .then(() => {
            setIsSavingField(false);
            setShowSaveFieldFeedbackMessage(true);
            setErrorMessage('');
            setTimeout(() => {
                setShowSaveFieldFeedbackMessage(false);
            }, 1000);
        })
            .catch((error) => {
            setIsSavingField(false);
            setShowSaveFieldFeedbackMessage(false);
            const errorMessage = transformUnknownErrorToErrorMessage(error);
            setErrorMessage(errorMessage);
        });
    };
    const getFieldDisabledStatus = (): boolean => {
        return isDisabled || isSavingField;
    };
    return (<div className={styles.container}>
      <div className={styles.select}>
        <SelectField value={value} disabled={getFieldDisabledStatus()} onChangeExtended={handleSelectValue} onClick={onSelectElementClick} errorText={errorMessage} successText={showSaveFieldFeedbackMessage
            ? successMessage
            : isSavingField
                ? savingMessage
                : ''} style={{ marginTop: '-1.5em', width: 320 }}>
          {options.map((option) => (<OptionField key={option.value} value={option.value} primaryText={option.label} disabled={option.disabled}/>))}
        </SelectField>
      </div>
      {isSavingField || showSaveFieldFeedbackMessage ? (<div className={styles.feedback}>
          {isSavingField ? (<LoadingIcon color={accessibleValidatorGreen} size={18}/>) : (<CheckCircleIcon size={20} color={accessibleValidatorGreen}/>)}
        </div>) : null}
    </div>);
};
