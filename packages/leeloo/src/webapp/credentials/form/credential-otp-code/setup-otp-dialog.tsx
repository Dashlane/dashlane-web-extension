import { ChangeEvent, useState } from 'react';
import { Dialog, jsx, TextArea } from '@dashlane/design-system';
import { FlexContainer, GridChild, GridContainer, } from '@dashlane/ui-components';
import { DataStatus } from '@dashlane/framework-react/src/hooks/types-queries';
import { NumberBadge } from 'webapp/components/number-badge/number-badge';
import useTranslate from 'libs/i18n/useTranslate';
import { openUrl } from 'libs/external-urls';
import { useOTPCode } from '../../hooks/use-otp-code';
import { ParsedURL } from '@dashlane/url-parser';
export interface SetupOtpDialogProps {
    onSubmit: (value: string) => void;
    onClose: () => void;
    isOpen: boolean;
    url: string;
    title: string;
}
interface StepProps {
    content: string;
    rank: number;
}
const I18N_KEYS = {
    STEP_1_TEXT: 'webapp_credential_otp_setup_step1_text',
    STEP_2_TEXT: 'webapp_credential_otp_setup_step2_text',
    STEP_3_TEXT: 'webapp_credential_otp_setup_step3_text',
    ENTER_CODE_LABEL: 'webapp_credential_otp_setup_input_label',
    NEXT_BUTTON: 'webapp_credential_otp_setup_next_button',
    NEXT_BUTTON_DISABLED_TOOLTIP: 'webapp_credential_otp_setup_next_button_disabled_tooltip',
    INCORRECT_CODE_ERROR: 'webapp_credential_otp_setup_incorrect_setup_code_error',
    GO_TO_BUTTON: 'webapp_credential_otp_setup_goto_website_button',
};
const SetupOtpDialogStep = ({ rank, content }: StepProps) => {
    return (<GridContainer as="li" gap="16px" gridTemplateColumns="35px 1fr" alignItems="center" justifyContent="flex-start" sx={{
            width: '100%',
        }}>
      <GridChild as={NumberBadge} rank={rank}/>
      {content}
    </GridContainer>);
};
export const SetupOtpDialog = ({ title, isOpen, url, onClose, onSubmit, }: SetupOtpDialogProps) => {
    const { translate } = useTranslate();
    const [setupCode, setSetupCode] = useState<string>('');
    const otpCodeResult = useOTPCode(setupCode);
    const hasErrors = !!setupCode && otpCodeResult.status === DataStatus.Error;
    const shouldDisableSubmit = otpCodeResult.status !== DataStatus.Success;
    const nextButtonHandler = () => {
        if (otpCodeResult.status === DataStatus.Success) {
            onSubmit(otpCodeResult.data?.url);
            onClose();
        }
    };
    const hostname = new ParsedURL(url).getHostname();
    const onCodeChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
        event.preventDefault();
        event.stopPropagation();
        setSetupCode(event.target.value);
    };
    return (<Dialog title={`Set up OTP for ${title}`} isOpen={isOpen} onClose={onClose} closeActionLabel="Close" actions={{
            primary: hostname
                ? {
                    icon: 'ActionOpenExternalLinkOutlined',
                    layout: 'iconTrailing',
                    children: translate(I18N_KEYS.GO_TO_BUTTON, { domain: hostname }),
                    onClick: () => openUrl(url),
                }
                : undefined,
            secondary: {
                children: translate(I18N_KEYS.NEXT_BUTTON),
                onClick: nextButtonHandler,
                disabled: shouldDisableSubmit,
                tooltip: translate(I18N_KEYS.NEXT_BUTTON_DISABLED_TOOLTIP),
            },
        }}>
      <FlexContainer as="ol" gap="16px">
        <SetupOtpDialogStep rank={1} key="2fa-settings" content={translate(I18N_KEYS.STEP_1_TEXT)}/>
        <SetupOtpDialogStep rank={2} key="2fa-turn-on" content={translate(I18N_KEYS.STEP_2_TEXT)}/>
        <SetupOtpDialogStep rank={3} key="enter-setup-code" content={translate(I18N_KEYS.STEP_3_TEXT)}/>
      </FlexContainer>
      <TextArea error={hasErrors} feedback={hasErrors ? 'Incorrect setup code entered' : ''} label="Enter setup code" onChange={onCodeChange}/>
    </Dialog>);
};
