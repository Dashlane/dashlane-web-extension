import { DataStatus, useModuleQuery } from "@dashlane/framework-react";
import { Button, Infobox } from "@dashlane/design-system";
import { userConsentsApi } from "@dashlane/privacy-contracts";
import useTranslate from "../../../../libs/i18n/useTranslate";
import { openUrl } from "../../../../libs/external-urls";
import { Setting } from "../../shared/setting";
const I18N_KEYS = {
  TITLE: "webapp_privacy_settings_email_admin_title",
  DESCRIPTION: "webapp_privacy_settings_admin_description",
  INFOBOX_TITLE: "webapp_privacy_settings_admin_infobox_title",
  INFOBOX_DESCRIPTION: "webapp_privacy_settings_admin_infobox_description",
  BUTTON: "webapp_privacy_settings_admin_button",
};
export const AdminEmailPreferenceSetting = () => {
  const { translate } = useTranslate();
  const getEmailPreferenceLinkResult = useModuleQuery(
    userConsentsApi,
    "getEmailPreferenceLink"
  );
  if (getEmailPreferenceLinkResult.status !== DataStatus.Success) {
    return null;
  }
  const handleButtonClick = () => {
    openUrl(getEmailPreferenceLinkResult.data);
  };
  return (
    <Setting
      title={translate(I18N_KEYS.TITLE)}
      description={translate(I18N_KEYS.DESCRIPTION)}
    >
      <Infobox
        title={translate(I18N_KEYS.INFOBOX_TITLE)}
        description={translate(I18N_KEYS.INFOBOX_DESCRIPTION)}
        mood="neutral"
        size="medium"
      />

      <Button
        icon="ActionOpenExternalLinkOutlined"
        layout="iconTrailing"
        intensity="quiet"
        onClick={handleButtonClick}
      >
        {translate(I18N_KEYS.BUTTON)}
      </Button>
    </Setting>
  );
};
