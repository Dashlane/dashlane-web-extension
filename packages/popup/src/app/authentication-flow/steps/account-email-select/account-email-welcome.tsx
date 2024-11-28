import { Button, Heading, jsx, Paragraph } from "@dashlane/design-system";
import { PopupLoginLayout } from "../../components/popup-login-layout";
import { FORM_SX_STYLES } from "../../constants";
import useTranslate from "../../../../libs/i18n/useTranslate";
const I18N_KEYS = {
  CREATE_ACCOUNT: "login/welcome_create_account_button",
  DESCRIPTION: "login/welcome_description",
  HEADING: "login/welcome_heading",
  LOG_IN: "login/welcome_log_in_button",
};
interface WelcomeStepProps {
  onCreateAccountClick: () => void;
  onLoginClick: () => void;
}
export const AccountEmailWelcome = ({
  onCreateAccountClick,
  onLoginClick,
}: WelcomeStepProps) => {
  const { translate } = useTranslate();
  return (
    <form sx={FORM_SX_STYLES} noValidate>
      <PopupLoginLayout>
        <Heading
          as="h1"
          color="ds.text.neutral.catchy"
          textStyle="ds.title.section.medium"
          sx={{
            marginBottom: "24px",
            textTransform: "uppercase",
            fontWeight: "bolder",
          }}
        >
          {translate(I18N_KEYS.HEADING)}
        </Heading>

        <Paragraph
          color="ds.text.neutral.quiet"
          sx={{
            marginBottom: "16px",
          }}
        >
          {translate(I18N_KEYS.DESCRIPTION)}
        </Paragraph>
      </PopupLoginLayout>

      <Button
        onClick={onLoginClick}
        id="extng-account-email-next-button"
        fullsize
        size="large"
        sx={{ marginBottom: "8px" }}
      >
        {translate(I18N_KEYS.LOG_IN)}
      </Button>
      <Button
        onClick={onCreateAccountClick}
        mood="neutral"
        intensity="quiet"
        fullsize
        size="large"
      >
        {translate(I18N_KEYS.CREATE_ACCOUNT)}
      </Button>
    </form>
  );
};
