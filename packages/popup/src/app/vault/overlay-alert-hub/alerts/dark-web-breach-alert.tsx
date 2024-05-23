import * as React from 'react';
import { BreachItemView } from '@dashlane/communication';
import { PageView } from '@dashlane/hermes';
import Dialog from 'components/dialog';
import useTranslate from 'libs/i18n/useTranslate';
import { markBreachesAsViewed } from 'src/libs/api';
import { openWebAppAndClosePopup } from 'src/app/helpers';
import { logPageView } from 'libs/logs/logEvent';
import styles from './styles.css';
interface DarkWebAlertProps {
    pendingBreaches: BreachItemView[];
    onClick: () => void;
    onDismiss: () => void;
}
const I18N_KEYS = {
    DIALOG_TITLE: 'embed_alert_dark_web_alert_title',
    DIALOG_ACTION_VIEW: 'embed_alert_dark_web_alert_cta',
    DIALOG_ACTION_DISMISS: 'embed_alert_dark_web_alert_dismiss',
    DIALOG_INFO: 'embed_alert_dark_web_alert_content',
};
export const DarkWebBreachAlert = ({ pendingBreaches, onClick, onDismiss, }: DarkWebAlertProps) => {
    const { translate } = useTranslate();
    React.useEffect(() => {
        logPageView(PageView.ToolsDarkWebMonitoringAlert);
    }, []);
    const onCancel = () => {
        markBreachesAsViewed(pendingBreaches);
        onDismiss();
    };
    const onConfirm = async () => {
        markBreachesAsViewed(pendingBreaches);
        await openWebAppAndClosePopup({ route: '/security-dashboard' });
        onClick();
    };
    return (<Dialog cancelLabel={translate(I18N_KEYS.DIALOG_ACTION_DISMISS)} confirmLabel={translate(I18N_KEYS.DIALOG_ACTION_VIEW)} onCancel={onCancel} onConfirm={() => {
            void onConfirm();
        }} visible>
      <header className={styles.dialogHeader}>
        {translate(I18N_KEYS.DIALOG_TITLE)}
      </header>

      <div className={styles.dialogBody}>
        {translate(I18N_KEYS.DIALOG_INFO)}
      </div>
    </Dialog>);
};
