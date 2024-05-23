import React from 'react';
import { TokenInput } from '@dashlane/ui-components';
import { Paragraph } from '@dashlane/design-system';
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
      <Paragraph id={DESCRIPTION_LABEL_ID} color="ds.text.neutral.quiet" style={{ marginBottom: '16px' }}>
        {title}
      </Paragraph>

      <TokenInput autoFocus value={securityToken} maxLength={maxLength} inputMode="numeric" id={TOKEN_INPUT_TEST_ID} data-testid="token-input" onChange={onTokenInputChange} feedbackType={errorMessage ? 'error' : undefined} feedbackText={errorMessage} aria-labelledby={DESCRIPTION_LABEL_ID}/>
    </>);
};
