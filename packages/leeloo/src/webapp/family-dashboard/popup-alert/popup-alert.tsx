import React, { useEffect } from 'react';
import { Alert, AlertSeverity } from '@dashlane/ui-components';
import styles from './styles.css';
import useTranslate from 'libs/i18n/useTranslate';
const ALERT_MS = 5000;
export interface PopupAlertProps {
    id: number;
    severity: AlertSeverity;
    message: string;
    onHide: () => void;
}
export const PopupAlert = ({ id, severity, message, onHide, }: PopupAlertProps) => {
    const { translate } = useTranslate();
    useEffect(() => {
        if (!id) {
            return undefined;
        }
        const timer = setTimeout(onHide, ALERT_MS);
        return () => {
            return clearTimeout(timer);
        };
    }, [id, onHide]);
    return (<div className={styles.wrapper}>
      <div className={styles.popup}>
        <Alert severity={severity} showIcon closeIconName={severity === AlertSeverity.ERROR
            ? translate('_common_alert_dismiss_button')
            : undefined}>
          {message}
        </Alert>
      </div>
    </div>);
};
