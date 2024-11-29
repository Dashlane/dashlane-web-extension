import { Flex, Heading, Icon, Paragraph } from "@dashlane/design-system";
import useTranslate from "../../../libs/i18n/useTranslate";
const ERROR_MATCH_KEYS = {
  CouldNotGetTeamStatus: "COULD_NOT_GET_TEAM_STATUS",
  TeamIdNotFound: "TEAM_ID_NOT_FOUND",
  UserNotAuthorized: "USER_NOT_AUTHORIZED",
  InvalidSsoState: "INVALID_SSO_STATE",
  GenericSsoError: "GENERIC_SSO_ERROR",
};
const I18N_KEYS = {
  ERROR_HEADER: "team_settings_sso_error_header",
  RETRY: "team_settings_sso_error_button_retry",
  COULD_NOT_GET_TEAM_STATUS: "team_settings_sso_error_message_team_status",
  TEAM_ID_NOT_FOUND: "team_settings_sso_error_message_team_id",
  USER_NOT_AUTHORIZED: "team_settings_sso_error_message_not_authorized",
  INVALID_SSO_STATE: "team_settings_sso_error_message_invalid_sso_state",
  GENERIC_SSO_ERROR: "team_settings_sso_error_message_generic",
};
interface ContentErrorProps {
  errorTag?: string;
}
export const ContentError = ({
  errorTag = ERROR_MATCH_KEYS.GenericSsoError,
}: ContentErrorProps) => {
  const { translate } = useTranslate();
  return (
    <Flex
      alignItems="center"
      justifyContent="center"
      fullWidth
      gap="40px"
      sx={{ mt: "20vh", flexDirection: "column" }}
    >
      <Icon
        name="FeedbackFailOutlined"
        color="ds.text.danger.quiet"
        sx={{ height: "64px", width: "64px" }}
      />
      <Flex alignItems="center" flexDirection="column" gap="8px">
        <Heading textStyle="ds.title.section.large" as="h1">
          {translate(I18N_KEYS.ERROR_HEADER)}
        </Heading>
        {errorTag ? (
          <Paragraph>
            {translate(I18N_KEYS[ERROR_MATCH_KEYS[errorTag]])}
          </Paragraph>
        ) : null}
      </Flex>
    </Flex>
  );
};
