import { redirect, useRouterGlobalSettingsContext } from "../../libs/router";
import useTranslate from "../../libs/i18n/useTranslate";
import {
  HeaderDropdown,
  MenuItems,
} from "../components/header/vault-header-with-dropdown";
import { VaultItemType } from "@dashlane/vault-contracts";
import { getCurrentCountry } from "./helpers";
import { Country, CurrentLocationUpdated } from "@dashlane/communication";
import { IdVaultItemType } from "./types";
interface Props {
  currentLocation: CurrentLocationUpdated;
  buttonLabel?: string;
  buttonClick?: () => void;
}
const I18N_KEYS = {
  ADD_NEW: "webapp_id_creation_header_btn",
  DRIVERLICENSE_NEW_BTN_DEFAULT:
    "webapp_id_creation_driverlicense_new_btn_default",
  FISCALID_NEW_BTN_DEFAULT: "webapp_id_creation_fiscalid_new_btn_default",
  IDCARD_NEW_BTN_DEFAULT: "webapp_id_creation_idcard_new_btn_default",
  PASSPORT_NEW_BTN_DEFAULT: "webapp_id_creation_passport_new_btn_default",
  SOCIALSECURITY_NEW_BTN_DEFAULT:
    "webapp_id_creation_socialsecurity_new_btn_default",
  SOCIALSECURITY_NEW_BTN_BR: "webapp_id_creation_socialsecurity_new_btn_br",
  SOCIALSECURITY_NEW_BTN_CA: "webapp_id_creation_socialsecurity_new_btn_ca",
  SOCIALSECURITY_NEW_BTN_GB: "webapp_id_creation_socialsecurity_new_btn_gb",
  SOCIALSECURITY_NEW_BTN_IE: "webapp_id_creation_socialsecurity_new_btn_ie",
  SOCIALSECURITY_NEW_BTN_IT: "webapp_id_creation_socialsecurity_new_btn_it",
  SOCIALSECURITY_NEW_BTN_JP: "webapp_id_creation_socialsecurity_new_btn_jp",
  SOCIALSECURITY_NEW_BTN_NL: "webapp_id_creation_socialsecurity_new_btn_nl",
  SOCIALSECURITY_NEW_BTN_NO: "webapp_id_creation_socialsecurity_new_btn_no",
  SOCIALSECURITY_NEW_BTN_PT: "webapp_id_creation_socialsecurity_new_btn_pt",
  SOCIALSECURITY_NEW_BTN_SE: "webapp_id_creation_socialsecurity_new_btn_se",
};
const countryToSocialSecurityKey = {
  [Country.BR]: I18N_KEYS.SOCIALSECURITY_NEW_BTN_BR,
  [Country.CA]: I18N_KEYS.SOCIALSECURITY_NEW_BTN_CA,
  [Country.GB]: I18N_KEYS.SOCIALSECURITY_NEW_BTN_GB,
  [Country.IE]: I18N_KEYS.SOCIALSECURITY_NEW_BTN_IE,
  [Country.IT]: I18N_KEYS.SOCIALSECURITY_NEW_BTN_IT,
  [Country.JP]: I18N_KEYS.SOCIALSECURITY_NEW_BTN_JP,
  [Country.NL]: I18N_KEYS.SOCIALSECURITY_NEW_BTN_NL,
  [Country.NO]: I18N_KEYS.SOCIALSECURITY_NEW_BTN_NO,
  [Country.PT]: I18N_KEYS.SOCIALSECURITY_NEW_BTN_PT,
  [Country.SE]: I18N_KEYS.SOCIALSECURITY_NEW_BTN_SE,
};
export const IdsAddDropdown = ({
  buttonLabel,
  buttonClick,
  currentLocation,
}: Props) => {
  const { translate } = useTranslate();
  const { routes } = useRouterGlobalSettingsContext();
  const currentCountry = getCurrentCountry(currentLocation);
  const handleAddItemClick = (idType: IdVaultItemType) => () => {
    buttonClick?.();
    redirect(routes.userAddIdDocument(idType));
  };
  const menuItems: MenuItems[] = [
    {
      icon: "ItemIdOutlined",
      label: translate(I18N_KEYS.IDCARD_NEW_BTN_DEFAULT),
      onClick: handleAddItemClick(VaultItemType.IdCard),
    },
    {
      icon: "ItemSocialSecurityOutlined",
      label: translate(
        countryToSocialSecurityKey[currentCountry] ??
          I18N_KEYS.SOCIALSECURITY_NEW_BTN_DEFAULT
      ),
      onClick: handleAddItemClick(VaultItemType.SocialSecurityId),
    },
    {
      icon: "ItemDriversLicenseOutlined",
      label: translate(I18N_KEYS.DRIVERLICENSE_NEW_BTN_DEFAULT),
      onClick: handleAddItemClick(VaultItemType.DriversLicense),
    },
    {
      icon: "ItemPassportOutlined",
      label: translate(I18N_KEYS.PASSPORT_NEW_BTN_DEFAULT),
      onClick: handleAddItemClick(VaultItemType.Passport),
    },
    {
      icon: "ItemTaxNumberOutlined",
      label: translate(I18N_KEYS.FISCALID_NEW_BTN_DEFAULT),
      onClick: handleAddItemClick(VaultItemType.FiscalId),
    },
  ];
  return (
    <HeaderDropdown
      buttonLabel={buttonLabel ?? translate(I18N_KEYS.ADD_NEW)}
      menuItems={menuItems}
    />
  );
};
