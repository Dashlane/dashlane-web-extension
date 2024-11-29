import { Button, Infobox } from "@dashlane/design-system";
import {
  ClickOrigin,
  Button as HermesButton,
  UserClickEvent,
} from "@dashlane/hermes";
import useTranslate from "../../../../libs/i18n/useTranslate";
import { useFrozenState } from "../../../../libs/frozen-state/frozen-state-dialog-context";
import { Link, useRouterGlobalSettingsContext } from "../../../../libs/router";
import { useIsB2CUserFrozen } from "../../../../libs/frozen-state/hooks/use-is-b2c-user-frozen";
import { logEvent } from "../../../../libs/logs/logEvent";
const I18N_KEYS = {
  TITLE: "webapp_import_data_frozen_infobox_title",
  DESCRIPTION: "webapp_import_data_frozen_infobox_description",
  MANAGE_LOGINS_BUTTON:
    "webapp_import_data_frozen_infobox_manage_logins_button",
  UPGRADE_BUTTON: "webapp_import_data_frozen_infobox_upgrade_button",
};
export const FrozenStateInfobox = () => {
  const { translate } = useTranslate();
  const { openDialog } = useFrozenState();
  const { routes } = useRouterGlobalSettingsContext();
  const isB2CUserFrozen = useIsB2CUserFrozen();
  if (!isB2CUserFrozen) {
    return null;
  }
  const handleClickManageLogins = () => {
    logEvent(
      new UserClickEvent({
        button: HermesButton.ManageLogins,
        clickOrigin: ClickOrigin.BannerFrozenAccount,
      })
    );
  };
  const handleClickUpgrade = () => {
    logEvent(
      new UserClickEvent({
        button: HermesButton.UpgradePaidPlan,
        clickOrigin: ClickOrigin.BannerFrozenAccount,
      })
    );
    openDialog();
  };
  return (
    <Infobox
      sx={{ margin: "10px 32px" }}
      title={translate(I18N_KEYS.TITLE)}
      description={translate(I18N_KEYS.DESCRIPTION)}
      size="large"
      mood="danger"
      icon="FeedbackFailOutlined"
      actions={[
        <Button
          intensity="quiet"
          key={translate(I18N_KEYS.MANAGE_LOGINS_BUTTON)}
          onClick={handleClickManageLogins}
          as={Link}
          to={routes.userCredentials}
        >
          {translate(I18N_KEYS.MANAGE_LOGINS_BUTTON)}
        </Button>,
        <Button
          intensity="catchy"
          key={translate(I18N_KEYS.UPGRADE_BUTTON)}
          onClick={handleClickUpgrade}
        >
          {translate(I18N_KEYS.UPGRADE_BUTTON)}
        </Button>,
      ]}
    />
  );
};
