import { Fragment, useEffect } from 'react';
import { ActivationFlowDisplayKeyView } from '@dashlane/account-recovery-contracts';
import { Button } from '@dashlane/design-system';
import { useAnalyticsCommands } from '@dashlane/framework-react';
import { Result } from '@dashlane/framework-types';
import { PageView } from '@dashlane/hermes';
import { DialogBody, DialogFooter, DialogTitle, Heading, jsx, KeyIcon, Paragraph, } from '@dashlane/ui-components';
import useTranslate from 'libs/i18n/useTranslate';
import { FORMATTED_RECOVERY_KEY_SEPARATOR, FORMATTED_RECOVERY_KEY_SEPARATOR_COUNT, FOUR_CHARACTERS_REGEX, } from 'webapp/account/constants';
const I18N_KEYS = {
    ARK_ACTIVATION_DISPLAY_KEY_STEP_TITLE: 'webapp_account_recovery_key_second_step_title',
    ARK_ACTIVATION_DISPLAY_KEY_STEP_DESCRIPTION: 'webapp_account_recovery_key_second_step_description',
    ARK_ACTIVATION_DISPLAY_KEY_STEP_HELPER_TEXT: 'webapp_account_recovery_key_second_step_helper_text',
    ARK_ACTIVATION_DISPLAY_KEY_STEP_BUTTON: '_common_action_continue',
};
interface Props extends Pick<ActivationFlowDisplayKeyView, 'recoveryKey'> {
    goToNextStep: () => Promise<Result<undefined>>;
    isLoading: boolean;
}
export const AccountRecoveryKeyActivationDisplayKeyStep = ({ recoveryKey, isLoading, goToNextStep, }: Props) => {
    const { translate } = useTranslate();
    const { trackPageView } = useAnalyticsCommands();
    useEffect(() => {
        trackPageView({
            pageView: PageView.SettingsSecurityRecoveryKeyStore,
        });
    }, []);
    const formattedRecoveryKey = ((recoveryKey ?? '').match(FOUR_CHARACTERS_REGEX) ?? []).map((recoveryKeySubString, index) => (<>
      <Paragraph as="span" sx={{ fontFamily: 'monospace' }}>
        {recoveryKeySubString}
      </Paragraph>
      {index !== FORMATTED_RECOVERY_KEY_SEPARATOR_COUNT && (<Paragraph as="span" sx={{ fontFamily: 'monospace' }} color="ds.text.warning.standard">
          {FORMATTED_RECOVERY_KEY_SEPARATOR}
        </Paragraph>)}
    </>));
    return (<>
      <KeyIcon size={77} color="ds.text.brand.quiet" sx={{ margin: '10px 0 30px 0' }}/>
      <DialogTitle>
        <Heading size="small" color="ds.text.neutral.catchy" sx={{ marginBottom: '16px' }}>
          {translate(I18N_KEYS.ARK_ACTIVATION_DISPLAY_KEY_STEP_TITLE)}
        </Heading>
      </DialogTitle>
      <DialogBody>
        <Paragraph color="ds.text.neutral.standard">
          {translate(I18N_KEYS.ARK_ACTIVATION_DISPLAY_KEY_STEP_DESCRIPTION)}
        </Paragraph>
        <Paragraph sx={{
            background: 'ds.container.agnostic.neutral.quiet',
            borderRadius: '10px',
            margin: '16px 0',
            padding: '16px',
        }}>
          {formattedRecoveryKey}
        </Paragraph>
        <Paragraph color="ds.text.neutral.standard">
          {translate(I18N_KEYS.ARK_ACTIVATION_DISPLAY_KEY_STEP_HELPER_TEXT)}
        </Paragraph>
      </DialogBody>
      <DialogFooter>
        <Button mood="brand" isLoading={isLoading} onClick={() => {
            void goToNextStep();
        }}>
          {translate(I18N_KEYS.ARK_ACTIVATION_DISPLAY_KEY_STEP_BUTTON)}
        </Button>
      </DialogFooter>
    </>);
};
