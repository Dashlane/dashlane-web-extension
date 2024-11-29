import {
  Button,
  Heading,
  Icon,
  LinkButton,
  Paragraph,
} from "@dashlane/design-system";
import useTranslate from "../../../libs/i18n/useTranslate";
const I18N_KEYS = {
  HEADING: "team_risk_detection_setup_error_heading",
  GENERIC_DESCRIPTION: "team_risk_detection_setup_error_generic_description",
  RETRY_DESCRIPTION: "team_risk_detection_setup_error_retry_description",
  RETRY_BUTTON: "team_risk_detection_setup_error_retry_button",
  HELP_CENTER_LINK: "team_risk_detection_setup_error_help_center_link",
};
interface LOMoErrorCardProps {
  helpCenterLink?: string;
  retryFunction?: () => void;
}
export const LOMoErrorCard = ({
  helpCenterLink,
  retryFunction,
}: LOMoErrorCardProps) => {
  const { translate } = useTranslate();
  return (
    <div
      sx={{
        minHeight: "680px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px",
      }}
    >
      <div
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          maxWidth: "480px",
        }}
      >
        <Icon
          name="FeedbackFailOutlined"
          color="ds.text.danger.standard"
          size="xlarge"
          sx={{
            marginBottom: "40px",
            width: "64px",
            height: "64px",
          }}
        />
        <Heading
          as="h1"
          textStyle="ds.title.section.large"
          color="ds.text.danger.standard"
          sx={{
            marginBottom: "8px",
          }}
        >
          {translate(I18N_KEYS.HEADING)}
        </Heading>
        <Paragraph
          sx={{
            textAlign: "center",
          }}
        >
          {retryFunction
            ? translate(I18N_KEYS.RETRY_DESCRIPTION)
            : translate(I18N_KEYS.GENERIC_DESCRIPTION)}
        </Paragraph>
        {retryFunction ? (
          <Button
            onClick={retryFunction}
            sx={{
              marginTop: "40px",
            }}
          >
            {translate(I18N_KEYS.RETRY_BUTTON)}
          </Button>
        ) : null}
        {helpCenterLink ? (
          <LinkButton
            isExternal
            href={helpCenterLink}
            sx={{
              marginTop: "40px",
            }}
          >
            {translate(I18N_KEYS.HELP_CENTER_LINK)}
          </LinkButton>
        ) : null}
      </div>
    </div>
  );
};
