import useTranslate from "../../../../libs/i18n/useTranslate";
import { SX_STYLES } from "./styles";
import illustration from "@dashlane/design-system/assets/illustrations/password-audits-with-activity-logs@2x-light.webp";
import { Icon, IndeterminateLoader, Paragraph } from "@dashlane/design-system";
const I18N_KEYS = {
  ERROR_TITLE: "team_audit_log_state_error_title",
  ERROR_DESCRIPTION: "team_audit_log_state_error_description",
  LOADING_TITLE: "team_audit_log_state_loading_title",
  LOADING_DESCRIPTION: "team_audit_log_state_loading_description",
  EMPTY_TITLE: "team_audit_log_state_empty_title",
  EMPTY_DESCRIPTION: "team_audit_log_state_empty_description",
};
const Explanation = ({
  title,
  description,
}: {
  title: string;
  description: string;
}) => {
  const { translate } = useTranslate();
  return (
    <>
      <Paragraph
        textStyle="ds.title.section.medium"
        color="ds.text.neutral.standard"
        sx={{ marginBottom: "4px" }}
      >
        {translate(title)}
      </Paragraph>
      <Paragraph
        textStyle="ds.body.reduced.regular"
        color="ds.text.neutral.quiet"
      >
        {translate(description)}
      </Paragraph>
    </>
  );
};
const AuditLogsError = () => (
  <div sx={SX_STYLES.STATE_WRAPPER}>
    <Icon
      name="FeedbackFailOutlined"
      color="ds.text.danger.quiet"
      size="xlarge"
    />
    <Explanation
      title={I18N_KEYS.ERROR_TITLE}
      description={I18N_KEYS.ERROR_DESCRIPTION}
    />
  </div>
);
const AuditLogsLoading = () => (
  <div sx={SX_STYLES.STATE_WRAPPER}>
    <IndeterminateLoader mood="brand" size="xlarge" />
    <Explanation
      title={I18N_KEYS.LOADING_TITLE}
      description={I18N_KEYS.LOADING_DESCRIPTION}
    />
  </div>
);
const AuditLogsEmpty = () => (
  <div sx={SX_STYLES.STATE_WRAPPER}>
    <img
      sx={{
        userSelect: "none",
        pointerEvents: "none",
        width: "360px",
        maxWidth: "100%",
        margin: "0 auto",
      }}
      alt=""
      aria-hidden={true}
      src={illustration}
    />
    <Explanation
      title={I18N_KEYS.EMPTY_TITLE}
      description={I18N_KEYS.EMPTY_DESCRIPTION}
    />
  </div>
);
export { AuditLogsError, AuditLogsLoading, AuditLogsEmpty };
