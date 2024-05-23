import { Fragment, useEffect } from 'react';
import { Button } from '@dashlane/design-system';
import { useAnalyticsCommands } from '@dashlane/framework-react';
import { Result } from '@dashlane/framework-types';
import { PageView } from '@dashlane/hermes';
import { DialogBody, DialogFooter, DialogTitle, Heading, jsx, KeyIcon, Paragraph, } from '@dashlane/ui-components';
import useTranslate from 'libs/i18n/useTranslate';
const I18N_KEYS = {
    ARK_GENERATE_NEW_KEY_TITLE: 'webapp_account_recovery_key_generate_new_key_title',
    ARK_GENERATE_NEW_KEY_DESCRIPTION: 'webapp_account_recovery_key_generate_new_key_description',
    ARK_GENERATE_NEW_KEY_CANCEL_BUTTON: '_common_action_cancel',
    ARK_GENERATE_NEW_KEY_CONTINUE_BUTTON: 'webapp_account_recovery_key_first_step_generate_key',
};
interface Props {
    requestActivation: () => Promise<Result<undefined>>;
    cancelActivation: () => Promise<Result<undefined>>;
}
export const AccountRecoveryKeyActivationGenerateNewKeyStep = ({ requestActivation, cancelActivation, }: Props) => {
    const { translate } = useTranslate();
    const { trackPageView } = useAnalyticsCommands();
    useEffect(() => {
        trackPageView({
            pageView: PageView.SettingsSecurityRecoveryKeyGenerateNew,
        });
    }, []);
    return (<>
      <KeyIcon size={77} color="ds.text.brand.quiet" sx={{ margin: '10px 0 30px 0' }}/>
      <DialogTitle>
        <Heading size="small" color="ds.text.neutral.catchy" sx={{ marginBottom: '16px' }}>
          {translate(I18N_KEYS.ARK_GENERATE_NEW_KEY_TITLE)}
        </Heading>
      </DialogTitle>
      <DialogBody>
        <Paragraph color="ds.text.neutral.standard">
          {translate(I18N_KEYS.ARK_GENERATE_NEW_KEY_DESCRIPTION)}
        </Paragraph>
      </DialogBody>
      <DialogFooter>
        <Button intensity="quiet" mood="neutral" sx={{ marginRight: '8px' }} onClick={() => {
            void cancelActivation();
        }}>
          {translate(I18N_KEYS.ARK_GENERATE_NEW_KEY_CANCEL_BUTTON)}
        </Button>
        <Button mood="brand" onClick={() => {
            void requestActivation();
        }}>
          {translate(I18N_KEYS.ARK_GENERATE_NEW_KEY_CONTINUE_BUTTON)}
        </Button>
      </DialogFooter>
    </>);
};
