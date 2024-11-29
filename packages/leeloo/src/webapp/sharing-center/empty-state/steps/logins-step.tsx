import { NextStep } from "../../../empty-state/shared/next-step";
import useTranslate from "../../../../libs/i18n/useTranslate";
import {
  redirect,
  useRouterGlobalSettingsContext,
} from "../../../../libs/router";
import { logGoToLoginsClick } from "../logs";
const I18N_KEYS = {
  TITLE: "webapp_sharing_center_empty_state_next_step_go_to_logins_title",
  DESCRIPTION:
    "webapp_sharing_center_empty_state_next_step_go_to_logins_description",
  BUTTON: "webapp_sharing_center_empty_state_next_step_go_to_logins_button",
};
export const LoginsStep = () => {
  const { translate } = useTranslate();
  const { routes } = useRouterGlobalSettingsContext();
  const onGoToLogins = () => {
    logGoToLoginsClick();
    redirect(routes.userCredentials);
  };
  return (
    <NextStep
      title={translate(I18N_KEYS.TITLE)}
      description={translate(I18N_KEYS.DESCRIPTION)}
      button={{
        children: translate(I18N_KEYS.BUTTON),
        layout: "iconTrailing",
        icon: "ArrowRightOutlined",
        mood: "brand",
        intensity: "catchy",
        onClick: onGoToLogins,
      }}
    />
  );
};
