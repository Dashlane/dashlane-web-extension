import { jsx, PropsOf, TextInput } from '@dashlane/ui-components';
import { ChangeEventHandler, FocusEventHandler, Key, KeyboardEventHandler, ReactElement, ReactNode, } from 'react';
import { useField } from 'formik';
import { InputWithActionButton } from 'libs/dashlane-style/text-input-with-action-button/input-with-action-button';
interface DomainFieldProps extends PropsOf<typeof TextInput> {
    actions?: ReactNode;
    endIcon?: ReactElement;
    fieldName: string;
    handleAdd: () => void;
    key?: Key | undefined;
}
export const DomainField = ({ actions, endIcon, fieldName, feedbackType: externalFeedbackType, feedbackText: externalFeedbackText, handleAdd, ...restProps }: DomainFieldProps) => {
    const [{ value: { name: domainUrl }, onBlur, ...restField }, { error }, { setValue },] = useField(fieldName);
    const feedbackText = domainUrl ? externalFeedbackText ?? error : undefined;
    const feedbackType = externalFeedbackType ?? feedbackText ? 'error' : undefined;
    const handleChange: ChangeEventHandler<HTMLInputElement> = ({ currentTarget: { value }, }) => {
        setValue({ name: value });
    };
    const handleKeyPress: KeyboardEventHandler<HTMLInputElement | HTMLTextAreaElement> = (e) => {
        if (e.key === 'Enter') {
            handleAdd();
            e.preventDefault();
            e.stopPropagation();
        }
    };
    const handleBlur: FocusEventHandler<HTMLInputElement | HTMLTextAreaElement> = (e) => {
        if (e.currentTarget.value && !e.currentTarget.readOnly) {
            handleAdd();
        }
        onBlur?.(e);
    };
    return (<InputWithActionButton textInputProps={{
            id: fieldName,
            endAdornment: endIcon,
            feedbackText: feedbackText,
            feedbackType: feedbackType,
            fullWidth: true,
            value: domainUrl,
            ...restField,
            ...restProps,
            onChange: handleChange,
            onKeyPress: handleKeyPress,
            onBlur: handleBlur,
        }} tooltipProps={{ passThrough: true }} replacementActions={actions}/>);
};
