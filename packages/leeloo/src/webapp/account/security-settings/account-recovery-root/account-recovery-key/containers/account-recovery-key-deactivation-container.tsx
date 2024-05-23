import { useEffect, useState } from 'react';
import classnames from 'classnames';
import { accountRecoveryKeyApi } from '@dashlane/account-recovery-contracts';
import { Button } from '@dashlane/design-system';
import { useAnalyticsCommands, useModuleCommands, } from '@dashlane/framework-react';
import { isFailure } from '@dashlane/framework-types';
import { DeleteKeyReason, PageView } from '@dashlane/hermes';
import { Dialog, DialogBody, DialogFooter, DialogTitle, Heading, jsx, KeyIcon, Paragraph, } from '@dashlane/ui-components';
import useTranslate from 'libs/i18n/useTranslate';
import { allIgnoreClickOutsideClassName } from 'webapp/variables';
import { AccountRecoveryKeyErrorDialogBody } from '../components';
import { logUserDeleteAccountRecoveryKey } from 'webapp/account/security-settings/account-recovery-root/account-recovery-key/helpers/logs';
const I18N_KEYS = {
    ARK_DEACTIVATION_DIALOG_TITLE: 'webapp_account_recovery_key_deactivation_title',
    ARK_DEACTIVATION_DIALOG_DESCRIPTION: 'webapp_account_recovery_key_deactivation_description',
    BUTTON_CLOSE_DIALOG: '_common_dialog_dismiss_button',
    BUTTON_CANCEL: '_common_action_cancel',
    BUTTON_TURN_OFF: 'webapp_account_recovery_key_deactivation_turn_off',
};
interface Props {
    onClose: () => void;
}
export const AccountRecoveryKeyDeactivationContainer = ({ onClose: handleCloseDeactivationDialog, }: Props) => {
    const { translate } = useTranslate();
    const { trackPageView } = useAnalyticsCommands();
    const { deactivate } = useModuleCommands(accountRecoveryKeyApi);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    useEffect(() => {
        trackPageView({
            pageView: PageView.SettingsSecurityRecoveryKeyDisable,
        });
    }, []);
    const handleDeactivate = async () => {
        try {
            setLoading(true);
            const resp = await deactivate({ reason: 'SETTINGS' });
            if (isFailure(resp)) {
                setError(resp.error.tag);
                return;
            }
            logUserDeleteAccountRecoveryKey(DeleteKeyReason.SettingDisabled);
            setLoading(false);
            handleCloseDeactivationDialog();
        }
        catch (err) {
            setError(err);
        }
    };
    const handleCloseErrorDialog = () => {
        setError(null);
        handleCloseDeactivationDialog();
    };
    const dialogProps = {
        isOpen: true,
        disableOutsideClickClose: true,
        disableScrolling: true,
        disableUserInputTrap: true,
        disableEscapeKeyClose: true,
        closeIconName: translate(I18N_KEYS.BUTTON_CLOSE_DIALOG),
        modalContentClassName: classnames(allIgnoreClickOutsideClassName),
    };
    if (error) {
        return (<Dialog {...dialogProps} onClose={handleCloseErrorDialog}>
        <AccountRecoveryKeyErrorDialogBody error={error} onClose={handleCloseErrorDialog}/>
      </Dialog>);
    }
    return (<Dialog {...dialogProps} onClose={handleCloseDeactivationDialog}>
      <KeyIcon size={77} color="ds.text.brand.quiet" sx={{ margin: '10px 0 30px 0' }}/>
      <DialogTitle>
        <Heading size="small" color="ds.text.neutral.catchy" sx={{ marginBottom: '16px' }}>
          {translate(I18N_KEYS.ARK_DEACTIVATION_DIALOG_TITLE)}
        </Heading>
      </DialogTitle>
      <DialogBody>
        <Paragraph color="ds.text.neutral.standard">
          {translate(I18N_KEYS.ARK_DEACTIVATION_DIALOG_DESCRIPTION)}
        </Paragraph>
      </DialogBody>
      <DialogFooter>
        <Button intensity="quiet" mood="neutral" sx={{ marginRight: '8px' }} onClick={handleCloseDeactivationDialog}>
          {translate(I18N_KEYS.BUTTON_CANCEL)}
        </Button>
        <Button isLoading={loading} mood="brand" onClick={() => {
            void handleDeactivate();
        }}>
          {translate(I18N_KEYS.BUTTON_TURN_OFF)}
        </Button>
      </DialogFooter>
    </Dialog>);
};
