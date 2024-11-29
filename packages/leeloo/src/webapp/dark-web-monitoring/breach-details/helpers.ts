import { BreachLeakedDataType } from "@dashlane/communication";
import { TranslatorInterface } from "../../../libs/i18n/types";
const I18N_KEYS = {
  DATA_ADDRESS: "webapp_darkweb_alert_data_address",
  DATA_CREDIT_CARD: "webapp_darkweb_alert_data_credit_card",
  DATA_EMAIL: "webapp_darkweb_alert_data_email",
  DATA_IP_ADDRESS: "webapp_darkweb_alert_data_ip_address",
  DATA_LOCATION: "webapp_darkweb_alert_data_location",
  DATA_PASSWORD: "webapp_darkweb_alert_data_password",
  DATA_PERSONAL_INFO: "webapp_darkweb_alert_data_personal_info",
  DATA_PHONE: "webapp_darkweb_alert_data_phone",
  DATA_SOCIAL_NETWORK_INFO: "webapp_darkweb_alert_data_social_network_info",
  DATA_SSN: "webapp_darkweb_alert_data_social_security_number",
  DATA_USERNAME: "webapp_darkweb_alert_data_username",
};
export const affectedDataTranslationKeyMap: Record<
  BreachLeakedDataType,
  string
> = {
  [BreachLeakedDataType.Address]: I18N_KEYS.DATA_ADDRESS,
  [BreachLeakedDataType.CreditCard]: I18N_KEYS.DATA_CREDIT_CARD,
  [BreachLeakedDataType.Email]: I18N_KEYS.DATA_EMAIL,
  [BreachLeakedDataType.IP]: I18N_KEYS.DATA_IP_ADDRESS,
  [BreachLeakedDataType.Location]: I18N_KEYS.DATA_LOCATION,
  [BreachLeakedDataType.Password]: I18N_KEYS.DATA_PASSWORD,
  [BreachLeakedDataType.PersonalInfo]: I18N_KEYS.DATA_PERSONAL_INFO,
  [BreachLeakedDataType.Phone]: I18N_KEYS.DATA_PHONE,
  [BreachLeakedDataType.SocialNetwork]: I18N_KEYS.DATA_SOCIAL_NETWORK_INFO,
  [BreachLeakedDataType.SSN]: I18N_KEYS.DATA_SSN,
  [BreachLeakedDataType.Username]: I18N_KEYS.DATA_USERNAME,
};
export const getFormattedLeakedDataTypes = (
  leakedDataTypes: BreachLeakedDataType[],
  translate: TranslatorInterface,
  omitPassword?: boolean
): string => {
  return leakedDataTypes
    .filter((data) => !omitPassword || data !== BreachLeakedDataType.Password)
    .map((data) => translate(affectedDataTranslationKeyMap[data]))
    .join(", ");
};
