import { redirect, useRouterGlobalSettingsContext } from "../../libs/router";
import useTranslate from "../../libs/i18n/useTranslate";
import {
  HeaderDropdown,
  MenuItems,
} from "../components/header/vault-header-with-dropdown";
const I18N_KEYS = {
  ADD_NEW: "webapp_personal_info_header_add",
  ADD_ADDRESS: "webapp_personal_info_header_add_address",
  ADD_COMPANY: "webapp_personal_info_header_add_company",
  ADD_EMAIL: "webapp_personal_info_header_add_email",
  ADD_NAME: "webapp_personal_info_header_add_name",
  ADD_PHONE: "webapp_personal_info_header_add_phone",
  ADD_WEBSITE: "webapp_personal_info_header_add_website",
};
export const PersonalInfoAddDropdown = ({
  buttonLabel,
}: {
  buttonLabel?: string;
}) => {
  const { routes } = useRouterGlobalSettingsContext();
  const { translate } = useTranslate();
  const handleAddItemClick = (route: string) => () => {
    redirect(route);
  };
  const menuItems: MenuItems[] = [
    {
      icon: "ItemPersonalInfoOutlined",
      label: translate(I18N_KEYS.ADD_NAME),
      onClick: handleAddItemClick(routes.userAddPersonalInfoIdentity),
    },
    {
      icon: "ItemEmailOutlined",
      label: translate(I18N_KEYS.ADD_EMAIL),
      onClick: handleAddItemClick(routes.userAddPersonalInfoEmail),
    },
    {
      icon: "ItemPhoneHomeOutlined",
      label: translate(I18N_KEYS.ADD_PHONE),
      onClick: handleAddItemClick(routes.userAddPersonalInfoPhone),
    },
    {
      icon: "HomeOutlined",
      label: translate(I18N_KEYS.ADD_ADDRESS),
      onClick: handleAddItemClick(routes.userAddPersonalInfoAddress),
    },
    {
      icon: "ItemCompanyOutlined",
      label: translate(I18N_KEYS.ADD_COMPANY),
      onClick: handleAddItemClick(routes.userAddPersonalInfoCompany),
    },
    {
      icon: "WebOutlined",
      label: translate(I18N_KEYS.ADD_WEBSITE),
      onClick: handleAddItemClick(routes.userAddPersonalInfoWebsite),
    },
  ];
  return (
    <HeaderDropdown
      buttonLabel={buttonLabel ?? translate(I18N_KEYS.ADD_NEW)}
      menuItems={menuItems}
    />
  );
};
