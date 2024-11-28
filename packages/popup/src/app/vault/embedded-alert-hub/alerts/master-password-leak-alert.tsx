import { memo } from "react";
import { Button, Infobox, jsx } from "@dashlane/design-system";
import useTranslate from "../../../../libs/i18n/useTranslate";
import { openWebAppAndClosePopup } from "../../../helpers";
const I18N_KEYS = {
  TITLE: "embed_alert_leaked_master_password_title",
  DESCRIPTION: "embed_alert_leaked_master_password_description_markup",
  BLOG_LINK: "embed_alert_leaked_master_password_dismiss",
  OPEN_SETTINGS: "embed_alert_leaked_master_password_action_open_settings",
};
interface OnboardingAlertProps {
  onDismiss: () => void;
}
export const MasterPasswordLeakAlert = ({
  onDismiss,
}: OnboardingAlertProps) => {
  const { translate, translateMarkup } = useTranslate();
  const onSettingsClick = () => {
    void openWebAppAndClosePopup({
      route: "/security-settings",
    });
  };
  return (
    <Infobox
      title={translate(I18N_KEYS.TITLE)}
      description={translateMarkup(I18N_KEYS.DESCRIPTION)}
      mood="danger"
      size="large"
      sx={{
        margin: "0 16px",
      }}
      actions={[
        <Button
          key="blog-link"
          mood="danger"
          intensity="quiet"
          onClick={onDismiss}
          size="small"
        >
          {translate(I18N_KEYS.BLOG_LINK)}
        </Button>,
        <Button
          key="setting-link"
          mood="danger"
          onClick={onSettingsClick}
          size="small"
        >
          {translate(I18N_KEYS.OPEN_SETTINGS)}
        </Button>,
      ]}
    />
  );
};
