import { Fragment } from 'react';
import { jsx } from '@dashlane/design-system';
import useTranslate from 'libs/i18n/useTranslate';
import { redirect } from 'libs/router';
import { useRouterGlobalSettingsContext } from 'libs/router/RouterGlobalSettingsProvider';
import { Connected as NotificationsDropdown } from 'webapp/bell-notifications/connected';
import { HeaderAccountMenu } from 'webapp/components/header/header-account-menu';
import { DropdownItem, VaultHeaderWithDropdown, } from 'webapp/components/header/vault-header-with-dropdown';
const I18N_KEYS = {
    ADD_NEW: 'webapp_personal_info_header_add',
    ADD_ADDRESS: 'webapp_personal_info_header_add_address',
    ADD_COMPANY: 'webapp_personal_info_header_add_company',
    ADD_EMAIL: 'webapp_personal_info_header_add_email',
    ADD_NAME: 'webapp_personal_info_header_add_name',
    ADD_PHONE: 'webapp_personal_info_header_add_phone',
    ADD_WEBSITE: 'webapp_personal_info_header_add_website',
};
export const PersonalInfoHeader = () => {
    const { routes } = useRouterGlobalSettingsContext();
    const { translate } = useTranslate();
    const handleAddItemClick = (route: string) => () => {
        redirect(route);
    };
    const menuItems = [
        {
            label: translate(I18N_KEYS.ADD_NAME),
            onClick: handleAddItemClick(routes.userAddPersonalInfoIdentity),
        },
        {
            label: translate(I18N_KEYS.ADD_EMAIL),
            onClick: handleAddItemClick(routes.userAddPersonalInfoEmail),
        },
        {
            label: translate(I18N_KEYS.ADD_PHONE),
            onClick: handleAddItemClick(routes.userAddPersonalInfoPhone),
        },
        {
            label: translate(I18N_KEYS.ADD_ADDRESS),
            onClick: handleAddItemClick(routes.userAddPersonalInfoAddress),
        },
        {
            label: translate(I18N_KEYS.ADD_COMPANY),
            onClick: handleAddItemClick(routes.userAddPersonalInfoCompany),
        },
        {
            label: translate(I18N_KEYS.ADD_WEBSITE),
            onClick: handleAddItemClick(routes.userAddPersonalInfoWebsite),
        },
    ];
    return (<VaultHeaderWithDropdown buttonLabel={translate(I18N_KEYS.ADD_NEW)} menuItemContents={menuItems.map(({ label, onClick }) => (<DropdownItem label={label} onClick={onClick} key={label}/>))} endWidget={<>
          <HeaderAccountMenu />
          <NotificationsDropdown />
        </>}/>);
};
