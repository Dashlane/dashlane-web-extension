import { Fragment } from 'react';
import { DialogBody, DialogFooter, DialogTitle, Heading, jsx, KeyIcon, Paragraph, } from '@dashlane/ui-components';
import { Button } from '@dashlane/design-system';
import { Result } from '@dashlane/framework-types';
import useTranslate from 'libs/i18n/useTranslate';
const I18N_KEYS = {
    ARK_GENERATE_NEW_KEY_CANCEL_TITLE: 'webapp_account_recovery_key_cancel_generate_new_key_title',
    ARK_GENERATE_NEW_KEY_CANCEL_DESCRIPTION: 'webapp_account_recovery_key_cancel_new_key_description',
    ARK_GENERATE_NEW_KEY_CANCEL_GO_BACK_BUTTON: '_common_action_go_back',
    ARK_GENERATE_NEW_KEY_CANCEL_BUTTON: 'webapp_account_recovery_key_cancel_new_key_button',
};
interface Props {
    goToPrevStep: () => Promise<Result<undefined>>;
    onClose: () => void;
}
export const AccountRecoveryKeyActivationCancelNewKeyStep = ({ goToPrevStep, onClose, }: Props) => {
    const { translate } = useTranslate();
    return (<>
      <KeyIcon size={77} color="ds.text.brand.quiet" sx={{ margin: '10px 0 30px 0' }}/>
      <DialogTitle>
        <Heading size="small" color="ds.text.neutral.catchy" sx={{ marginBottom: '16px' }}>
          {translate(I18N_KEYS.ARK_GENERATE_NEW_KEY_CANCEL_TITLE)}
        </Heading>
      </DialogTitle>
      <DialogBody>
        <Paragraph color="ds.text.neutral.standard">
          {translate(I18N_KEYS.ARK_GENERATE_NEW_KEY_CANCEL_DESCRIPTION)}
        </Paragraph>
      </DialogBody>
      <DialogFooter>
        <Button intensity="quiet" mood="neutral" sx={{ marginRight: '8px' }} onClick={() => {
            void goToPrevStep();
        }}>
          {translate(I18N_KEYS.ARK_GENERATE_NEW_KEY_CANCEL_GO_BACK_BUTTON)}
        </Button>
        <Button mood="brand" onClick={onClose}>
          {translate(I18N_KEYS.ARK_GENERATE_NEW_KEY_CANCEL_BUTTON)}
        </Button>
      </DialogFooter>
    </>);
};
