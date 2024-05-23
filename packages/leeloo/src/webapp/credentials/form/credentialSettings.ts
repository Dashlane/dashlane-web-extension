import { FormEditableData } from './credential-form';
export enum Field {
    SECONDARY_LOGIN,
    OTP_CODE
}
export const isOtpCodeFieldVisible = (editableValues: FormEditableData): boolean => {
    return Boolean(editableValues.otpURL) || Boolean(editableValues.otpSecret);
};
export const isSecondaryLoginFieldVisible = (editableValues: FormEditableData): boolean => {
    const { username, alternativeUsername } = editableValues;
    return Boolean(username) || Boolean(alternativeUsername);
};
export const isValueFieldVisible = (editableValues: FormEditableData) => {
    const fieldVisibility = {
        [Field.OTP_CODE]: isOtpCodeFieldVisible(editableValues),
        [Field.SECONDARY_LOGIN]: isSecondaryLoginFieldVisible(editableValues),
    };
    return (field: Field, fieldValue?: string | boolean) => {
        return fieldVisibility[field] || !!fieldValue;
    };
};
