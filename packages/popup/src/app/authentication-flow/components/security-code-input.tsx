import React, { Fragment } from 'react';
import { jsx } from '@dashlane/design-system';
import { Paragraph, TokenInput } from '@dashlane/ui-components';
interface Props {
    securityToken: string;
    maxLength: number;
    title: string;
    onTokenInputChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    errorMessage?: string;
}
const TOKEN_INPUT_TEST_ID = 'security-code-input';
const DESCRIPTION_LABEL_ID = 'securityCodeInstruction';
export const SecurityCodeInput = ({ securityToken, maxLength, title, onTokenInputChange, errorMessage, }: Props) => {
    return (<>
      <Paragraph id={DESCRIPTION_LABEL_ID} size="medium" color="ds.text.neutral.standard" sx={{
            marginBottom: '24px',
        }}>
        {title}
      </Paragraph>
      <TokenInput id="code" theme="primary" autoFocus value={securityToken} maxLength={maxLength} inputMode="numeric" data-testid={TOKEN_INPUT_TEST_ID} onChange={onTokenInputChange} feedbackType={errorMessage ? 'error' : undefined} feedbackText={errorMessage} feedbackTextId="login-feedback-text" aria-labelledby={DESCRIPTION_LABEL_ID}/>
    </>);
};
