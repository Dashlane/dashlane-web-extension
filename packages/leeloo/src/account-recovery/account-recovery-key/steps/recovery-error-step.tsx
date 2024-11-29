import { useEffect } from "react";
import {
  accountRecoveryKeyApi,
  RecoveryFlowView,
} from "@dashlane/account-recovery-contracts";
import {
  Button,
  Flex,
  Heading,
  Icon,
  Paragraph,
} from "@dashlane/design-system";
import { useModuleCommands } from "@dashlane/framework-react";
import {
  FlowStep,
  UseKeyErrorName,
  UserUseAccountRecoveryKeyEvent,
} from "@dashlane/hermes";
import { ACCOUNT_RECOVERY_KEY_URL_SEGMENT } from "../../../app/routes/constants";
import useTranslate from "../../../libs/i18n/useTranslate";
import { redirect } from "../../../libs/router";
import { logEvent } from "../../../libs/logs/logEvent";
const I18N_KEYS = {
  TITLE: "login_account_recovery_key_error_screen_title",
  DESCRIPTION: "login_account_recovery_key_error_screen_description",
  TRY_AGAIN_BUTTON: "login_account_recovery_key_error_screen_try_again_button",
};
interface Props extends Omit<RecoveryFlowView, "step"> {
  error?: string;
}
export const RecoveryErrorStep = ({ error }: Props) => {
  const { tryAgainRecovery } = useModuleCommands(accountRecoveryKeyApi);
  const handleTryAgainRecovery = () => {
    tryAgainRecovery();
    redirect(ACCOUNT_RECOVERY_KEY_URL_SEGMENT);
  };
  useEffect(() => {
    logEvent(
      new UserUseAccountRecoveryKeyEvent({
        flowStep: FlowStep.Error,
        useKeyErrorName:
          error === "WRONG_RECOVERY_KEY_ERROR"
            ? UseKeyErrorName.WrongKeyEntered
            : UseKeyErrorName.Unknown,
      })
    );
  }, []);
  const { translate } = useTranslate();
  return (
    <Flex
      flexDirection="column"
      alignItems="center"
      sx={{
        margin: "0 auto",
        textAlign: "center",
      }}
    >
      <Icon
        name="FeedbackFailOutlined"
        size="large"
        color="ds.text.danger.quiet"
        sx={{ marginBottom: "48px", width: "62px", height: "62px" }}
      />

      <Heading
        as="h1"
        textStyle="ds.title.section.large"
        sx={{ marginBottom: "16px" }}
      >
        {translate(I18N_KEYS.TITLE)}
      </Heading>
      <Paragraph
        as="label"
        textStyle="ds.body.standard.regular"
        sx={{ marginBottom: "48px" }}
      >
        {translate(I18N_KEYS.DESCRIPTION)}
      </Paragraph>
      <Button onClick={handleTryAgainRecovery}>
        {translate(I18N_KEYS.TRY_AGAIN_BUTTON)}
      </Button>
    </Flex>
  );
};
