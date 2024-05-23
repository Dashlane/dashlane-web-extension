import { Icon, jsx } from '@dashlane/design-system';
import { Link } from 'libs/router';
import { useRouterGlobalSettingsContext } from 'libs/router/RouterGlobalSettingsProvider';
import useTranslate from 'libs/i18n/useTranslate';
import { useTrialDiscontinuedDialogContext } from 'libs/trial/trialDiscontinuationDialogContext';
import { VaultHeaderButton } from 'webapp/components/header/vault-header-button';
const I18N_KEYS = {
    VIEW_HISTORY: 'webapp_password_history_all_passwords_view_header_title',
};
const PasswordHistoryButton = () => {
    const { routes } = useRouterGlobalSettingsContext();
    const { translate } = useTranslate();
    const { openDialog: openTrialDiscontinuedDialog, shouldShowTrialDiscontinuedDialog, } = useTrialDiscontinuedDialogContext();
    if (shouldShowTrialDiscontinuedDialog === null) {
        return null;
    }
    return shouldShowTrialDiscontinuedDialog ? (<VaultHeaderButton onClick={openTrialDiscontinuedDialog} icon={<Icon name="HistoryBackupOutlined"/>}>
      {translate(I18N_KEYS.VIEW_HISTORY)}
    </VaultHeaderButton>) : (<Link to={routes.userPasswordHistory} tabIndex={-1}>
      <VaultHeaderButton icon={<Icon name="HistoryBackupOutlined"/>}>
        {translate(I18N_KEYS.VIEW_HISTORY)}
      </VaultHeaderButton>
    </Link>);
};
export default PasswordHistoryButton;
