import React from 'react';
import { Icon } from '@dashlane/design-system';
import useTranslate from 'libs/i18n/useTranslate';
import { useRouterGlobalSettingsContext } from 'libs/router/RouterGlobalSettingsProvider';
import { redirect } from 'libs/router';
import { Connected as NotificationsDropdown } from 'webapp/bell-notifications/connected';
import { DropdownItem, VaultHeaderWithDropdown, } from 'webapp/components/header/vault-header-with-dropdown';
import { HeaderAccountMenu } from 'webapp/components/header/header-account-menu';
const I18N_KEYS = {
    ADD_PAYMENT: 'payments_header_add_payment',
    ADD_BANK_ACCOUNT: 'payments_header_add_bank_account',
    ADD_PAYMENT_CARD: 'payments_header_add_payment_card',
    ADD_PAYMENT_TOOLTIP: 'payments_header_add_payment_tooltip',
};
export const PaymentsHeader = () => {
    const { translate } = useTranslate();
    const { routes } = useRouterGlobalSettingsContext();
    const handleAddItemClick = (route: string) => () => {
        redirect(route);
    };
    const menuItems = [
        {
            icon: <Icon name="ItemPaymentOutlined" color="ds.oddity.brand"/>,
            label: translate(I18N_KEYS.ADD_PAYMENT_CARD),
            onClick: handleAddItemClick(routes.userAddPaymentCard),
        },
        {
            icon: <Icon name="ItemBankAccountOutlined" color="ds.oddity.brand"/>,
            label: translate(I18N_KEYS.ADD_BANK_ACCOUNT),
            onClick: handleAddItemClick(routes.userAddBankAccount),
        },
    ];
    return (<VaultHeaderWithDropdown buttonLabel={translate(I18N_KEYS.ADD_PAYMENT)} endWidget={<>
          <HeaderAccountMenu />
          <NotificationsDropdown />
        </>} menuItemContents={menuItems.map(({ icon, label, onClick }) => (<DropdownItem icon={icon} label={label} onClick={onClick} key={label}/>))}/>);
};
