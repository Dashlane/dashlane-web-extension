import { ChangeEvent, useState } from 'react';
import { RECOVERY_KEY_LENGTH } from 'webapp/account/constants';
export function useAccountRecoveryKeyInputRecoveryFlow() {
    const [inputValue, setInputValue] = useState<string>('');
    const handleChangeInputValue = (eventOrValue: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement> | string) => {
        const updatedValue = typeof eventOrValue === 'string'
            ? eventOrValue
            : eventOrValue.target.value;
        const value = updatedValue.replaceAll('-', '').toUpperCase();
        setInputValue(value);
    };
    return {
        inputValue,
        isInputValid: inputValue.length === RECOVERY_KEY_LENGTH,
        handleChangeInputValue,
    };
}
