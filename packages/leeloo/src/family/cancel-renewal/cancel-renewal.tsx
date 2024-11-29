import * as React from "react";
import { InfoCircleIcon } from "@dashlane/ui-components";
import { FamilyRenewalPlatform } from "@dashlane/communication";
import useTranslate from "../../libs/i18n/useTranslate";
import DangerButton from "../../libs/dashlane-style/buttons/modern/danger";
import { redirectToUrl } from "../../libs/external-urls";
import { assertUnreachable } from "../../libs/assert-unreachable";
import { stores } from "../../libs/third-party-stores";
import colorVars from "../../libs/dashlane-style/globals/color-variables.css";
import styles from "./styles.css";
const I18N_KEYS = {
  TITLE: "family_invitee_page_confirm_renewal_message_title",
  DESCRIPTION_IOS:
    "family_invitee_page_confirm_renewal_message_description_ios",
  DESCRIPTION_MAC:
    "family_invitee_page_confirm_renewal_message_description_mac",
  DESCRIPTION_PLAYSTORE:
    "family_invitee_page_confirm_renewal_message_description_playstore",
  CANCEL_SUBSCRIPTION_BUTTON:
    "family_invitee_page_confirm_renewal_message_button_title",
};
const BUTTON_URLS = {
  PLAYSTORE: stores.PLAYSTORE,
  APPLE: stores.APPLE,
};
interface CancelRenewalProps {
  platform: FamilyRenewalPlatform;
}
const getButtonUrl = (platform: FamilyRenewalPlatform) => {
  if (platform === FamilyRenewalPlatform.PLAY_STORE) {
    return BUTTON_URLS.PLAYSTORE;
  } else if (
    platform === FamilyRenewalPlatform.IOS_APP_STORE ||
    platform === FamilyRenewalPlatform.MAC_STORE
  ) {
    return BUTTON_URLS.APPLE;
  }
  return assertUnreachable(platform);
};
export const CancelRenewal = ({ platform }: CancelRenewalProps) => {
  const { translate } = useTranslate();
  if (!platform) {
    return null;
  }
  const getDescription = () => {
    if (platform === FamilyRenewalPlatform.IOS_APP_STORE) {
      return translate(I18N_KEYS.DESCRIPTION_IOS);
    } else if (platform === FamilyRenewalPlatform.MAC_STORE) {
      return translate(I18N_KEYS.DESCRIPTION_MAC);
    } else if (platform === FamilyRenewalPlatform.PLAY_STORE) {
      return translate(I18N_KEYS.DESCRIPTION_PLAYSTORE);
    }
    return assertUnreachable(platform);
  };
  const onCancelSubscription = () => {
    redirectToUrl(getButtonUrl(platform));
  };
  return (
    <div className={styles.wrapper}>
      <p className={styles.titleSection}>
        <InfoCircleIcon color={colorVars["--functional-red-00"]} />
        <span className={styles.title}>{translate(I18N_KEYS.TITLE)}</span>
      </p>
      <p className={styles.description}>{getDescription()}</p>
      <DangerButton
        size="small"
        classNames={[styles.button]}
        label={translate(I18N_KEYS.CANCEL_SUBSCRIPTION_BUTTON)}
        onClick={onCancelSubscription}
      />
    </div>
  );
};
