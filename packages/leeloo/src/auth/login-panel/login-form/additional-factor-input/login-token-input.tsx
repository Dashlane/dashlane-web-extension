import React from 'react';
import useTranslate from 'libs/i18n/useTranslate';
import { colors, Paragraph, TokenInput } from '@dashlane/ui-components';
import { I18N_KEYS, I18N_TOKEN_ERROR_KEYS } from './I18N_KEYS';
interface Props {
    securityCode: string;
    maxLength: number;
    onTokenInputChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    onKeyDown: (event: React.KeyboardEvent<HTMLInputElement>) => void;
    hasError: boolean;
    error: string;
}
export const LoginTokenInput = ({ securityCode, maxLength, onTokenInputChange, onKeyDown, hasError, error, }: Props) => {
    const { translate } = useTranslate();
    return (<>
      <Paragraph sx={{ marginBottom: '12px' }} color={colors.grey00}>
        {translate(I18N_KEYS.SECURITY_CODE_DESCRIPTION)}
      </Paragraph>
      <TokenInput autoFocus value={securityCode} maxLength={maxLength} inputMode="numeric" data-testid="token-input" onChange={onTokenInputChange} onKeyDown={onKeyDown} feedbackType={hasError ? 'error' : undefined} feedbackText={hasError
            ? translate(I18N_TOKEN_ERROR_KEYS[error] ??
                I18N_TOKEN_ERROR_KEYS.UNKNOWN_ERROR)
            : ''}/>
    </>);
};
