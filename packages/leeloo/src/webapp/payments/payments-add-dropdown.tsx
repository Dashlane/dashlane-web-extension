import {
  HeaderDropdown,
  MenuItems,
} from "../components/header/vault-header-with-dropdown";
import useTranslate from "../../libs/i18n/useTranslate";
import { redirect, useRouterGlobalSettingsContext } from "../../libs/router";
const I18N_KEYS = {
  ADD_PAYMENT: "payments_header_add_payment",
  ADD_BANK_ACCOUNT: "payments_header_add_bank_account",
  ADD_PAYMENT_CARD: "payments_header_add_payment_card",
  ADD_PAYMENT_TOOLTIP: "payments_header_add_payment_tooltip",
};
export const PaymentsAddDropdown = ({
  buttonLabel,
  buttonClick,
}: {
  buttonLabel?: string;
  buttonClick?: () => void;
}) => {
  const { translate } = useTranslate();
  const { routes } = useRouterGlobalSettingsContext();
  const handleAddItemClick = (route: string) => () => {
    buttonClick?.();
    redirect(route);
  };
  const menuItems: MenuItems[] = [
    {
      icon: "ItemPaymentOutlined",
      label: translate(I18N_KEYS.ADD_PAYMENT_CARD),
      onClick: handleAddItemClick(routes.userAddPaymentCard),
    },
    {
      icon: "ItemBankAccountOutlined",
      label: translate(I18N_KEYS.ADD_BANK_ACCOUNT),
      onClick: handleAddItemClick(routes.userAddBankAccount),
    },
  ];
  return (
    <HeaderDropdown
      buttonLabel={buttonLabel ?? translate(I18N_KEYS.ADD_PAYMENT)}
      menuItems={menuItems}
    />
  );
};
