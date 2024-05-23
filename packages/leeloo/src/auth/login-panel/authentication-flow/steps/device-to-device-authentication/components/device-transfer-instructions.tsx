import { useState } from 'react';
import { accountRecoveryKeyApi } from '@dashlane/account-recovery-contracts';
import { Button, Dialog, Infobox, jsx, Paragraph, } from '@dashlane/design-system';
import { useModuleCommands } from '@dashlane/framework-react';
import { FlowStep, UserUseAccountRecoveryKeyEvent } from '@dashlane/hermes';
import { FlexContainer } from '@dashlane/ui-components';
import { EmailHeader, Header, WebappLoginLayout, } from 'auth/login-panel/authentication-flow/components';
import { ACCOUNT_RECOVERY_KEY_URL_SEGMENT, ACCOUNT_RESET_INFO_URL, HELPCENTER_ACCOUNT_RECOVERY_OPTIONS_URL, } from 'app/routes/constants';
import useTranslate from 'libs/i18n/useTranslate';
import { logEvent } from 'libs/logs/logEvent';
import { redirect } from 'libs/router';
const instructionLineStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    bg: 'ds.container.expressive.brand.quiet.idle',
    minWidth: '30px',
    height: '30px',
    borderRadius: '3000px',
    padding: '3px',
    marginRight: '12px',
};
export const I18N_KEYS = {
    HEADING: 'webapp_device_to_device_authentication_instructions_title',
    FIRST_INSTRUCTION: 'webapp_device_to_device_authentication_instructions_first_paragraph',
    SECOND_INSTRUCTION: 'webapp_device_to_device_authentication_instructions_second_paragraph_markup',
    THIRD_INSTRUCTION: 'webapp_device_to_device_authentication_instructions_third_paragraph',
    NO_LOGGED_IN_DEVICE_BUTTON: 'webapp_device_to_device_authentication_instructions_button',
    ARK_DIALOG_TITLE: 'webapp_device_to_device_account_recovery_dialog_title',
    ARK_DIALOG_DESCRIPTION: 'webapp_device_to_device_account_recovery_dialog_description',
    ARK_DIALOG_START_RECOVERY_BUTTON: 'webapp_device_to_device_account_recovery_dialog_start_recovery_button',
    ARK_DIALOG_LOST_YOUR_KEY_BUTTON: 'webapp_device_to_device_account_recovery_dialog_lost_your_key_button',
    LOST_YOUR_KEY_DIALOG_TITLE: 'webapp_device_to_device_lost_your_key_dialog_title',
    LOST_YOUR_KEY_DIALOG_DESCRIPTION: 'webapp_device_to_device_lost_your_key_dialog_description',
    LOST_YOUR_KEY_DIALOG_LEARN_MORE_BUTTON: 'webapp_device_to_device_lost_your_key_dialog_learn_more_button',
    LOST_YOUR_KEY_DIALOG_RESET_ACCOUNT_BUTTON: 'webapp_device_to_device_lost_your_key_dialog_reset_account_button',
    CLOSE_DIALOG: '_common_dialog_dismiss_button',
    INFOBOX: 'webapp_device_to_device_authentication_instructions_infobox',
};
interface DeviceTransferInstructionsProps {
    loginEmail?: string;
}
export const DeviceTransferInstructions = ({ loginEmail, }: DeviceTransferInstructionsProps) => {
    if (!loginEmail) {
        throw new Error('No login email');
    }
    const { translate } = useTranslate();
    const [isArkDialogOpen, setIsArkDialogOpen] = useState(false);
    const [isLostYourKeyDialogOpen, setIsLostYourKeyDialogOpen] = useState(false);
    const { startRecoveryFlow } = useModuleCommands(accountRecoveryKeyApi);
    const handleStartRecoveryClick = () => {
        void startRecoveryFlow({
            login: loginEmail,
        });
        logEvent(new UserUseAccountRecoveryKeyEvent({ flowStep: FlowStep.Start }));
        redirect(ACCOUNT_RECOVERY_KEY_URL_SEGMENT);
    };
    return (<WebappLoginLayout>
      <Header text={translate(I18N_KEYS.HEADING)}/>
      <EmailHeader selectedEmail={loginEmail}/>
      <Infobox title={translate(I18N_KEYS.INFOBOX)} size="small" mood="brand"/>
      <FlexContainer alignItems="center" flexWrap="nowrap">
        <div sx={instructionLineStyle}>
          <Paragraph color="ds.text.brand.standard" textStyle="ds.body.standard.strong">
            1
          </Paragraph>
        </div>
        <Paragraph>{translate(I18N_KEYS.FIRST_INSTRUCTION)}</Paragraph>
      </FlexContainer>
      <FlexContainer alignItems="center" flexWrap="nowrap">
        <div sx={instructionLineStyle}>
          <Paragraph color="ds.text.brand.standard" textStyle="ds.body.standard.strong">
            2
          </Paragraph>
        </div>
        <Paragraph>{translate.markup(I18N_KEYS.SECOND_INSTRUCTION)}</Paragraph>
      </FlexContainer>
      <FlexContainer alignItems="center" flexWrap="nowrap">
        <div sx={instructionLineStyle}>
          <Paragraph color="ds.text.brand.standard" textStyle="ds.body.standard.strong">
            3
          </Paragraph>
        </div>
        <Paragraph>{translate(I18N_KEYS.THIRD_INSTRUCTION)}</Paragraph>
      </FlexContainer>
      <Button mood="neutral" type="button" intensity="quiet" sx={{ marginTop: '8px', width: '100%' }} onClick={() => {
            setIsArkDialogOpen(true);
        }}>
        {translate(I18N_KEYS.NO_LOGGED_IN_DEVICE_BUTTON)}
      </Button>

      <Dialog title={translate(I18N_KEYS.ARK_DIALOG_TITLE)} isOpen={isArkDialogOpen} closeActionLabel={I18N_KEYS.CLOSE_DIALOG} onClose={() => setIsArkDialogOpen(false)} actions={{
            primary: {
                children: translate(I18N_KEYS.ARK_DIALOG_START_RECOVERY_BUTTON),
                onClick: handleStartRecoveryClick,
            },
            secondary: {
                children: translate(I18N_KEYS.ARK_DIALOG_LOST_YOUR_KEY_BUTTON),
                onClick: () => {
                    setIsArkDialogOpen(false);
                    setIsLostYourKeyDialogOpen(true);
                },
            },
        }}>
        <Paragraph color="ds.text.neutral.quiet">
          {translate(I18N_KEYS.ARK_DIALOG_DESCRIPTION)}
        </Paragraph>
      </Dialog>

      <Dialog title={translate(I18N_KEYS.LOST_YOUR_KEY_DIALOG_TITLE)} isOpen={isLostYourKeyDialogOpen} closeActionLabel={I18N_KEYS.CLOSE_DIALOG} onClose={() => setIsLostYourKeyDialogOpen(false)} actions={{
            primary: {
                children: translate(I18N_KEYS.LOST_YOUR_KEY_DIALOG_RESET_ACCOUNT_BUTTON),
                onClick: () => {
                    window.open(ACCOUNT_RESET_INFO_URL);
                },
            },
            secondary: {
                children: translate(I18N_KEYS.LOST_YOUR_KEY_DIALOG_LEARN_MORE_BUTTON),
                onClick: () => {
                    window.open(HELPCENTER_ACCOUNT_RECOVERY_OPTIONS_URL);
                },
            },
        }}>
        <Paragraph color="ds.text.neutral.quiet">
          {translate(I18N_KEYS.LOST_YOUR_KEY_DIALOG_DESCRIPTION)}
        </Paragraph>
      </Dialog>
    </WebappLoginLayout>);
};
