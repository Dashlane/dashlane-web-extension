import React from 'react';
import useTranslate from 'libs/i18n/useTranslate';
import styles from './email-heading.css';
export const I18N_KEYS = {
    LOGIN_DIFFERENT_ACCOUNT: 'webapp_login_form_password_fieldset_log_in_different_account',
};
interface EmailHeadingProps {
    login: string | null;
    onBackToEmailStepClick: () => void;
}
export const EmailHeading = ({ login, onBackToEmailStepClick, }: EmailHeadingProps) => {
    const { translate } = useTranslate();
    return (<div className={styles.emailContainer}>
      <h3 className={styles.email} data-testid="login-email-header">
        {login}
      </h3>
      <button className={styles.anotherAccount} onClick={onBackToEmailStepClick} type="button">
        {translate(I18N_KEYS.LOGIN_DIFFERENT_ACCOUNT)}
      </button>
    </div>);
};
