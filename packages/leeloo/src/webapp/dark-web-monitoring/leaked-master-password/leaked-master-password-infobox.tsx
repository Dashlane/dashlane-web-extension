import { Button, Infobox } from "@dashlane/design-system";
import { openUrl, redirectToUrl } from "../../../libs/external-urls";
import useTranslate from "../../../libs/i18n/useTranslate";
import { LEAKED_MASTER_PASSWORD_HC_ARTICLE } from "../../urls";
import { useLeakedMasterPassword } from "../../leaked-master-password/hooks/use-leaked-master-password";
const I18N_KEYS = {
  TITLE: "webapp_darkweb_leaked_master_password_title",
  DESCRIPTION: "webapp_darkweb_leaked_master_password_description",
  BLOG_LINK: "webapp_darkweb_leaked_master_password_blog_link",
  OPEN_SETTINGS: "webapp_darkweb_leaked_master_password_action_open_settings",
};
export const LeakedMasterPasswordInfobox = () => {
  const { translate } = useTranslate();
  const isLeakedMasterPassword = useLeakedMasterPassword();
  const onBlogClick = () => openUrl(LEAKED_MASTER_PASSWORD_HC_ARTICLE);
  const onSettingsClick = () => redirectToUrl("__REDACTED__");
  return isLeakedMasterPassword ? (
    <Infobox
      title={translate(I18N_KEYS.TITLE)}
      description={translate(I18N_KEYS.DESCRIPTION)}
      mood="danger"
      size="large"
      sx={{ marginBottom: "8px" }}
      actions={[
        <Button
          key="hc-link"
          mood="danger"
          intensity="quiet"
          onClick={onBlogClick}
          size="small"
        >
          {translate(I18N_KEYS.BLOG_LINK)}
        </Button>,
        <Button
          key="settings"
          mood="danger"
          onClick={onSettingsClick}
          size="small"
        >
          {translate(I18N_KEYS.OPEN_SETTINGS)}
        </Button>,
      ]}
    />
  ) : null;
};
