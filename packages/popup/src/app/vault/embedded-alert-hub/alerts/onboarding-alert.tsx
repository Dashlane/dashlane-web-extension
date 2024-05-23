import * as React from 'react';
import { Button, InfoBox } from '@dashlane/ui-components';
import useTranslate from 'libs/i18n/useTranslate';
import styles from 'app/vault/embedded-alert-hub/alerts/styles.css';
const I18N_KEYS = {
    CONTENT: 'embed_alert_webonboarding_login_content',
    DISMISS_LABEL: 'embed_alert_webonboarding_login_dismiss',
    TITLE: 'embed_alert_webonboarding_login_title',
};
interface OnboardingAlertProps {
    onDismiss: () => void;
}
const OnboardingAlertComponent: React.FC<OnboardingAlertProps> = ({ onDismiss, }) => {
    const { translate } = useTranslate();
    return (<InfoBox className={styles.alert} severity="strong" size="descriptive" title={translate(I18N_KEYS.TITLE)} actions={[
            <Button type="button" nature="secondary" key="secondary" onClick={onDismiss}>
          {translate(I18N_KEYS.DISMISS_LABEL)}
        </Button>,
        ]}>
      <p>{translate(I18N_KEYS.CONTENT)}</p>
    </InfoBox>);
};
export const OnboardingAlert = React.memo(OnboardingAlertComponent);
