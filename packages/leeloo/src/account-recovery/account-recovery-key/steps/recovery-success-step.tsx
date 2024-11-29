import { useEffect } from "react";
import {
  Button,
  ExpressiveIcon,
  Flex,
  Heading,
  Paragraph,
} from "@dashlane/design-system";
import { useAnalyticsCommands } from "@dashlane/framework-react";
import {
  DeleteKeyReason,
  FlowStep,
  PageView,
  UserUseAccountRecoveryKeyEvent,
} from "@dashlane/hermes";
import {
  ACCOUNT_RECOVERY_KEY_REACTIVATE_SETTINGS,
  CLIENT_URL_SEGMENT,
} from "../../../app/routes/constants";
import useTranslate from "../../../libs/i18n/useTranslate";
import { useHistory } from "../../../libs/router";
import { logEvent } from "../../../libs/logs/logEvent";
import { logUserDeleteAccountRecoveryKey } from "../../../webapp/account/security-settings/account-recovery-root/account-recovery-key/helpers/logs";
import { useIsMPlessUser } from "../../../webapp/account/security-settings/hooks/use-is-mpless-user";
const I18N_KEYS = {
  TITLE: "login_account_recovery_key_success_screen_title",
  DESCRIPTION_DONE: "login_account_recovery_key_success_screen_description",
  BUTTON_DONE: "_common_dialog_done_button",
  DESCRIPTION_ENABLE_ARK:
    "login_account_recovery_key_success_enable_ark_description",
  BUTTON_ENABKE_ARK: "login_account_recovery_key_success_enable_ark_button",
};
export const RecoverySuccessStep = () => {
  const { translate } = useTranslate();
  const history = useHistory();
  const { trackPageView } = useAnalyticsCommands();
  const { isMPLessUser } = useIsMPlessUser();
  useEffect(() => {
    trackPageView({
      pageView: PageView.LoginMasterPasswordAccountRecoverySuccess,
    });
  }, []);
  useEffect(() => {
    logEvent(
      new UserUseAccountRecoveryKeyEvent({
        flowStep: FlowStep.Complete,
      })
    );
    logUserDeleteAccountRecoveryKey(DeleteKeyReason.RecoveryKeyUsed);
  }, []);
  const handleRedirectToVault = () => {
    if (isMPLessUser) {
      history.push(CLIENT_URL_SEGMENT);
    } else {
      history.push(ACCOUNT_RECOVERY_KEY_REACTIVATE_SETTINGS);
    }
  };
  return (
    <Flex
      flexDirection="column"
      alignItems="center"
      sx={{
        margin: "0 auto",
        textAlign: "center",
      }}
    >
      <ExpressiveIcon
        name="FeedbackSuccessOutlined"
        size="xlarge"
        mood="positive"
        sx={{ marginBottom: "48px" }}
      />
      <Heading
        as="h1"
        textStyle="ds.title.section.large"
        sx={{ marginBottom: "16px" }}
      >
        {translate(I18N_KEYS.TITLE)}
      </Heading>

      {!isMPLessUser ? (
        <Paragraph as="label" sx={{ marginBottom: "48px" }}>
          {translate(I18N_KEYS.DESCRIPTION_DONE)}
        </Paragraph>
      ) : null}

      <Button onClick={handleRedirectToVault}>
        {translate(I18N_KEYS.BUTTON_DONE)}
      </Button>
    </Flex>
  );
};
