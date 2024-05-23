import { jsx } from '@dashlane/ui-components';
import { Fragment, MouseEvent, useEffect, useState } from 'react';
import { CSSTransition } from 'react-transition-group';
import classnames from 'classnames';
import queryString from 'query-string';
import { Lee } from 'lee';
import { AuthOptions, MarketingContentType } from 'auth/auth';
import { ACCOUNT_CREATION_TAC_URL_SEGMENT, ACCOUNT_CREATION_URL_SEGMENT, } from 'app/routes/constants';
import { openDashlaneUrl } from 'libs/external-urls';
import { AuthLocationState, AuthPanelNavigation, Props as AuthPanelNavigationProps, } from 'auth/auth-panel-navigation/auth-panel-navigation';
import { useLocation } from 'libs/router';
import useTranslate from 'libs/i18n/useTranslate';
import { LoginForm } from './login-form/login-form';
import styles from './styles.css';
import authStyles from '../styles.css';
import transition from '../transition.css';
import { DebugDataDialog } from 'webapp/debug-data-dialog';
export interface Props {
    lee: Lee;
    options?: AuthOptions;
    location: AuthLocationState;
}
const I18N_KEYS = {
    WEBAPP_LOGIN_PANEL_LOADING: 'webapp_login_panel_loading',
    WEBAPP_AUTH_PANEL_CREATE_SIGN_UP: 'webapp_auth_panel_create_sign_up',
    WEBAPP_AUTH_PANEL_GET_STARTED: 'webapp_auth_panel_get_started',
    WEBAPP_AUTH_PANEL_CREATE_AN_ACCOUNT: 'webapp_auth_panel_create_an_account',
};
const DEFAULT_MARKETING_CONTENT_TYPE = MarketingContentType.Standard;
const LoginPanelLegacy = ({ options: { marketingContentType = DEFAULT_MARKETING_CONTENT_TYPE, requiredPermissions, } = {}, location, lee, }: Props) => {
    const { carbon: { localAccounts }, } = lee;
    const { search } = useLocation();
    const queryParams = queryString.parse(search);
    const preFilledEmail = queryParams.email;
    const prefilledOtpToken = queryParams.token;
    const { translate } = useTranslate();
    const [shouldAskMasterPassword, setShouldAskMasterPassword] = useState<boolean | undefined>(undefined);
    useEffect(() => {
        const askmp = !APP_PACKAGED_IN_EXTENSION || location.state?.ignoreRedirect
            ? false
            : location.search.includes('askmp');
        setShouldAskMasterPassword(askmp);
    }, [location.search]);
    const redirectToDownloadPage = (e: MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        const target = '*****';
        openDashlaneUrl(target, {
            type: 'authentication',
            action: 'createAccount',
        });
    };
    const isTACFlow = marketingContentType === MarketingContentType.DashlaneBusiness;
    const isAppFlow = marketingContentType === MarketingContentType.Standard;
    const shouldDisplayPanelNavigation = APP_PACKAGED_IN_EXTENSION || isAppFlow;
    const authPanelProps: Omit<AuthPanelNavigationProps, 'helperText'> = APP_PACKAGED_IN_DESKTOP || APP_PACKAGED_IN_EXTENSION
        ? {
            redirectLocation: marketingContentType === 'dashlaneBusiness'
                ? ACCOUNT_CREATION_TAC_URL_SEGMENT
                : ACCOUNT_CREATION_URL_SEGMENT,
            buttonText: translate(I18N_KEYS.WEBAPP_AUTH_PANEL_CREATE_SIGN_UP),
        }
        : {
            redirectLocation: '#',
            onClick: redirectToDownloadPage,
            buttonText: translate(I18N_KEYS.WEBAPP_AUTH_PANEL_GET_STARTED),
        };
    if (shouldAskMasterPassword === undefined) {
        return null;
    }
    return (<>
      {shouldDisplayPanelNavigation ? (<AuthPanelNavigation {...authPanelProps} helperText={translate(I18N_KEYS.WEBAPP_AUTH_PANEL_CREATE_AN_ACCOUNT)}/>) : null}

      <CSSTransition classNames={{
            appear: transition.appear,
            appearActive: transition.appearActive,
        }} appear in timeout={{ appear: 500, enter: 0, exit: 0 }}>
        <div className={styles.loginPanelWrapper}>
          <div className={classnames(authStyles.panel, styles.loginPanel)}>
            {localAccounts !== null ? (<LoginForm accounts={localAccounts} lee={lee} requiredPermissions={requiredPermissions} shouldAskMasterPassword={shouldAskMasterPassword} preFilledEmail={preFilledEmail} preFilledOtpToken={prefilledOtpToken} isTACFlow={isTACFlow}/>) : (<h1 className={styles.subheading}>
                {translate(I18N_KEYS.WEBAPP_LOGIN_PANEL_LOADING)}
              </h1>)}
          </div>
        </div>
      </CSSTransition>

      <DebugDataDialog layout="absolute"/>
    </>);
};
export default LoginPanelLegacy;
