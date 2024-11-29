import { Button, Infobox } from "@dashlane/design-system";
import { openUrl } from "../../../../../libs/external-urls";
import useTranslate from "../../../../../libs/i18n/useTranslate";
import { WEAK_MASTER_PASSWORD_HC_ARTICLE } from "../../../../urls";
const I18N_KEYS = {
  TITLE:
    "webapp_account_security_settings_changemp_section_weak_master_password_title",
  DESCRIPTION:
    "webapp_account_security_settings_changemp_section_weak_master_password_description",
  BLOG_LINK:
    "webapp_account_security_settings_changemp_section_weak_master_password_blog_link",
};
export const WeakMasterPasswordInfobox = () => {
  const { translate } = useTranslate();
  const onBlogClick = () => openUrl(WEAK_MASTER_PASSWORD_HC_ARTICLE);
  return (
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
          size="small"
          intensity="quiet"
          onClick={onBlogClick}
        >
          {translate(I18N_KEYS.BLOG_LINK)}
        </Button>,
      ]}
    />
  );
};
