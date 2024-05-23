import { Fragment, useEffect } from 'react';
import { Button } from '@dashlane/design-system';
import { Result } from '@dashlane/framework-types';
import { useAnalyticsCommands } from '@dashlane/framework-react';
import { FlowStep, PageView, UserCreateAccountRecoveryKeyEvent, } from '@dashlane/hermes';
import { DialogBody, DialogFooter, DialogTitle, Heading, jsx, KeyIcon, Paragraph, } from '@dashlane/ui-components';
import { logEvent } from 'libs/logs/logEvent';
import useTranslate from 'libs/i18n/useTranslate';
const I18N_KEYS = {
    ARK_ACTIVATION_INIT_STEP_TITLE: 'webapp_account_recovery_key_first_step_title',
    ARK_ACTIVATION_INIT_STEP_DESCRIPTION: 'webapp_account_recovery_key_first_step_description',
    ARK_ACTIVATION_INIT_STEP_BUTTON: 'webapp_account_recovery_key_first_step_generate_key',
};
interface Props {
    goToNextStep: () => Promise<Result<undefined>>;
}
export const AccountRecoveryKeyActivationInitStep = ({ goToNextStep, }: Props) => {
    const { translate } = useTranslate();
    const { trackPageView } = useAnalyticsCommands();
    useEffect(() => {
        trackPageView({
            pageView: PageView.SettingsSecurityRecoveryKeyEnable,
        });
    }, []);
    const logUserCreateAccountRecoveryKeyEvent = () => {
        void logEvent(new UserCreateAccountRecoveryKeyEvent({ flowStep: FlowStep.Start }));
    };
    const handleStartActivation = () => {
        logUserCreateAccountRecoveryKeyEvent();
        void goToNextStep();
    };
    return (<>
      <KeyIcon size={77} color="ds.text.brand.quiet" sx={{ margin: '10px 0 30px 0' }}/>
      <DialogTitle>
        <Heading size="small" color="ds.text.neutral.catchy" sx={{ marginBottom: '16px' }}>
          {translate(I18N_KEYS.ARK_ACTIVATION_INIT_STEP_TITLE)}
        </Heading>
      </DialogTitle>
      <DialogBody>
        <Paragraph color="ds.text.neutral.standard">
          {translate(I18N_KEYS.ARK_ACTIVATION_INIT_STEP_DESCRIPTION)}
        </Paragraph>
      </DialogBody>
      <DialogFooter>
        <Button mood="brand" onClick={() => {
            handleStartActivation();
        }}>
          {translate(I18N_KEYS.ARK_ACTIVATION_INIT_STEP_BUTTON)}
        </Button>
      </DialogFooter>
    </>);
};
