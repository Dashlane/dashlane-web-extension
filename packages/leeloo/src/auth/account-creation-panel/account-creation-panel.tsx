import { Fragment } from 'react';
import { jsx } from '@dashlane/ui-components';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { Lee } from 'lee';
import { AccountCreationForm } from './account-creation-form/account-creation-form';
import { LOGIN_URL_SEGMENT } from 'app/routes/constants';
import { AuthPanelNavigation } from 'auth/auth-panel-navigation/auth-panel-navigation';
import useTranslate from 'libs/i18n/useTranslate';
import { useRouterGlobalSettingsContext } from 'libs/router';
import transition from '../transition.css';
interface AccountCreationPanelProps {
    lee: Lee;
    options?: {
        isTACFlow: boolean;
    };
}
const I18N_KEYS = {
    ALREADY_HAVE_ACCOUNT_TEXT: 'webapp_auth_panel_already_an_account',
    LOGIN_CTA: 'webapp_auth_panel_login',
};
export const AccountCreationPanel = ({ lee, options: { isTACFlow } = { isTACFlow: false }, }: AccountCreationPanelProps) => {
    const { translate } = useTranslate();
    const { routes } = useRouterGlobalSettingsContext();
    return (<>
      <AuthPanelNavigation redirectLocation={{
            pathname: isTACFlow
                ? routes.teamRoutesBasePath + LOGIN_URL_SEGMENT
                : LOGIN_URL_SEGMENT,
            search: '',
            hash: '',
            state: { ignoreRedirect: true },
        }} helperText={translate(I18N_KEYS.ALREADY_HAVE_ACCOUNT_TEXT)} buttonText={translate(I18N_KEYS.LOGIN_CTA)}/>

      <TransitionGroup sx={{ paddingTop: '120px' }}>
        <CSSTransition classNames={{ ...transition }} timeout={{
            appear: 500,
            enter: 0,
            exit: 0,
        }} appear={true}>
          <div sx={{ padding: '50px', margin: '0 auto', maxWidth: '800px' }}>
            <AccountCreationForm isTACFlow={isTACFlow} lee={lee}/>
          </div>
        </CSSTransition>
      </TransitionGroup>
    </>);
};
