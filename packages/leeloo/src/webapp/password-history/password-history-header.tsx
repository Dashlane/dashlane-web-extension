import { Fragment } from 'react';
import { BackIcon, FlexContainer, Heading, jsx } from '@dashlane/ui-components';
import useTranslate from 'libs/i18n/useTranslate';
import { Link, useRouterGlobalSettingsContext } from 'libs/router';
import { Header } from 'webapp/components/header/header';
import { HeaderAccountMenu } from 'webapp/components/header/header-account-menu';
import { Connected as NotificationsDropdown } from 'webapp/bell-notifications/connected';
const I18N_KEYS = {
    BACK: '_common_action_back',
    PASSWORD_HISTORY_HEADER_TITLE: 'webapp_password_history_title',
};
export const PasswordHistoryHeader = () => {
    const { translate } = useTranslate();
    const { routes } = useRouterGlobalSettingsContext();
    return (<Header sx={{
            margin: '16px 0',
        }} startWidgets={() => (<FlexContainer as={Heading} size="small" alignItems="center" gap="20px">
          <Link to={routes.userCredentials} aria-label={translate(I18N_KEYS.BACK)}>
            <BackIcon />
          </Link>
          {translate(I18N_KEYS.PASSWORD_HISTORY_HEADER_TITLE)}
        </FlexContainer>)} endWidget={<>
          <HeaderAccountMenu />
          <NotificationsDropdown />
        </>}/>);
};
