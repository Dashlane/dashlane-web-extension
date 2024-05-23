import * as React from 'react';
import classnames from 'classnames';
import { colors, Paragraph } from '@dashlane/ui-components';
import { LocalAccountInfo } from '@dashlane/communication';
import { LoginStep } from 'auth/login-panel/login-form/types';
import useTranslate from 'libs/i18n/useTranslate';
import styles from './login-form-header.css';
const I18N_KEYS = {
    TITLE: 'webapp_login_form_heading_log_in',
    DESCRIPTION: 'webapp_login_form_password_step_webauthn_description',
};
interface LoginFormHeaderProps {
    login: string;
    step: LoginStep;
    lastSuccessfulAccount?: LocalAccountInfo;
}
export const LoginFormHeader = ({ login, step, lastSuccessfulAccount, }: LoginFormHeaderProps) => {
    const { translate } = useTranslate();
    const showWebAuthnDescriptionForPasswordStep = step === LoginStep.Password &&
        login === lastSuccessfulAccount?.login &&
        lastSuccessfulAccount.rememberMeType === 'webauthn' &&
        lastSuccessfulAccount.shouldAskMasterPassword;
    return (<header>
      <h1 className={classnames(styles.heading, {
            [styles.headingWithDescription]: showWebAuthnDescriptionForPasswordStep,
        })}>
        {translate(I18N_KEYS.TITLE)}
      </h1>

      {showWebAuthnDescriptionForPasswordStep ? (<Paragraph color={colors.dashGreen01} size="x-small" sx={{ mb: '16px', fontSize: '14px', lineHeight: '20px' }}>
          {translate(I18N_KEYS.DESCRIPTION)}
        </Paragraph>) : null}
    </header>);
};
