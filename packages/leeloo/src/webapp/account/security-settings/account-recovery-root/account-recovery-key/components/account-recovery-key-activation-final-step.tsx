import { Fragment, useEffect } from 'react';
import { Button } from '@dashlane/design-system';
import { useAnalyticsCommands } from '@dashlane/framework-react';
import { PageView } from '@dashlane/hermes';
import { CheckCircleIcon, DialogBody, DialogFooter, Heading, jsx, } from '@dashlane/ui-components';
import useTranslate from 'libs/i18n/useTranslate';
const I18N_KEYS = {
    ARK_ACTIVATION_INIT_STEP_DESCRIPTION: 'webapp_account_recovery_key_fourth_step_description',
    ARK_ACTIVATION_INIT_STEP_BUTTON: '_common_dialog_done_button',
};
export interface AccountRecoveryKeyActivationFinalStepProps {
    onClose: () => void;
}
export const AccountRecoveryKeyActivationFinalStep = ({ onClose, }: AccountRecoveryKeyActivationFinalStepProps) => {
    const { translate } = useTranslate();
    const { trackPageView } = useAnalyticsCommands();
    useEffect(() => {
        trackPageView({
            pageView: PageView.SettingsSecurityRecoveryKeySuccess,
        });
    }, []);
    return (<>
      <CheckCircleIcon size={77} color="ds.text.brand.quiet" sx={{ margin: '10px 0 30px 0' }}/>
      <DialogBody>
        <Heading color="ds.text.neutral.catchy" sx={{ fontSize: '32px', fontWeight: 500, marginBottom: '16px' }}>
          {translate(I18N_KEYS.ARK_ACTIVATION_INIT_STEP_DESCRIPTION)}
        </Heading>
      </DialogBody>
      <DialogFooter>
        <Button mood="brand" onClick={onClose}>
          {translate(I18N_KEYS.ARK_ACTIVATION_INIT_STEP_BUTTON)}
        </Button>
      </DialogFooter>
    </>);
};
