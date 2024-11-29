import { useHistory } from "react-router-dom";
import {
  Button,
  ExpressiveIcon,
  Flex,
  Paragraph,
} from "@dashlane/design-system";
import { ChangeLoginEmailError } from "@dashlane/account-contracts";
import useTranslate from "../../../libs/i18n/useTranslate";
import { useRouterGlobalSettingsContext } from "../../../libs/router";
const I18N_KEYS = {
  LOGIN_CHANGE_FAILED_TITLE: "login_account_recovery_key_error_screen_title",
  TOKEN_VALIDATION_FAILED_TITLE:
    "webapp_change_login_email_wrong_token_error_title",
  LOGIN_CHANGE_FAILED_DESCRIPTION:
    "login_account_recovery_key_error_screen_description",
  TOKEN_VALIDATION_FAILED_DESCRIPTION:
    "webapp_change_login_email_wrong_token_error_description",
  CANCEL_BUTTON: "_common_action_cancel",
  TRY_AGAIN_BUTTON: "_common_action_try_again",
};
type ChangeLoginErrorProps = {
  error?: ChangeLoginEmailError;
};
export const ChangeLoginError = ({ error }: ChangeLoginErrorProps) => {
  const { translate } = useTranslate();
  const { routes } = useRouterGlobalSettingsContext();
  const history = useHistory();
  return (
    <>
      <ExpressiveIcon
        name="FeedbackFailOutlined"
        size="xlarge"
        mood="danger"
        sx={{ marginBottom: "32px" }}
      />
      <Paragraph
        textStyle="ds.title.section.large"
        sx={{ marginBottom: "16px" }}
      >
        {translate(
          error
            ? I18N_KEYS[`${error}_TITLE`]
            : I18N_KEYS.LOGIN_CHANGE_FAILED_TITLE
        )}
      </Paragraph>
      <Paragraph>
        {translate(
          error
            ? I18N_KEYS[`${error}_DESCRIPTION`]
            : I18N_KEYS.LOGIN_CHANGE_FAILED_DESCRIPTION
        )}
      </Paragraph>
      <Flex sx={{ marginTop: "48px" }}>
        <Button
          mood="neutral"
          intensity="quiet"
          sx={{ marginRight: "8px" }}
          onClick={() => history.push(routes.userCredentials)}
        >
          {translate(I18N_KEYS.CANCEL_BUTTON)}
        </Button>
        <Button
          onClick={() => history.push(routes.changeLoginEmailAccountSettings)}
        >
          {translate(I18N_KEYS.TRY_AGAIN_BUTTON)}
        </Button>
      </Flex>
    </>
  );
};
