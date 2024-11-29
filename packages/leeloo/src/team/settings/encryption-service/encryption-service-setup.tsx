import { GridChild, GridContainer } from "@dashlane/ui-components";
import { Button, Card, Heading, Paragraph } from "@dashlane/design-system";
import { SsoSetupStep } from "@dashlane/hermes";
import useTranslate from "../../../libs/i18n/useTranslate";
import { useHistory } from "../../../libs/router";
import { BasicConfig } from "@dashlane/communication";
import { EncryptionServiceStatus } from "./encryption-service-status";
import { logSelfHostedSSOSetupStep } from "../sso-setup-logs";
const I18N_KEYS = {
  ES_HEADER: "team_settings_encryption_service_header",
  ES_DESCRIPTION: "team_settings_encryption_service_description",
  ES_DESCRIPTION_LINK: "team_settings_encryption_service_more_info_link",
  SET_UP: "team_settings_encryption_service_set_up",
  EDIT: "team_settings_button_edit_label",
  GET_STARTED: "team_settings_encryption_service_get_started",
};
export const encryptionServiceSubPath = `/encryption-service-settings`;
const ENCRYPTION_SERVICE_HELP_LINK = "__REDACTED__";
interface EncryptionServiceSetupProps {
  esConfig: BasicConfig | undefined;
  loading: boolean;
  parentPath: string;
  disableSetupButton: boolean | undefined;
}
export const EncryptionServiceSetup = ({
  esConfig,
  loading,
  parentPath,
  disableSetupButton,
}: EncryptionServiceSetupProps) => {
  const { translate } = useTranslate();
  const history = useHistory();
  const isPrimaryCta = !esConfig && !loading;
  return (
    <Card>
      <GridContainer
        gridTemplateAreas="'header button' 'description button' 'status .'"
        gridTemplateColumns="1fr auto"
        gap="8px"
      >
        <GridChild gridArea="header">
          {!esConfig ? (
            <Heading
              as="h3"
              color="ds.text.neutral.quiet"
              textStyle="ds.title.supporting.small"
            >
              {translate(I18N_KEYS.GET_STARTED)}
            </Heading>
          ) : null}
          <Heading as="h3" textStyle="ds.title.section.medium">
            {translate(I18N_KEYS.ES_HEADER)}
          </Heading>
        </GridChild>
        <GridChild gridArea="description">
          <Paragraph
            textStyle="ds.title.block.small"
            color="ds.text.neutral.quiet"
          >
            {translate(I18N_KEYS.ES_DESCRIPTION)}
          </Paragraph>
          <br />
          <Paragraph
            as="a"
            textStyle="ds.title.block.small"
            href={ENCRYPTION_SERVICE_HELP_LINK}
            color="ds.text.brand.standard"
            rel="noopener noreferrer"
            target="_blank"
          >
            {translate(I18N_KEYS.ES_DESCRIPTION_LINK)}
          </Paragraph>
        </GridChild>
        <GridChild
          id="esSetupButton"
          as={Button}
          disabled={loading || disableSetupButton}
          mood={isPrimaryCta ? "brand" : "neutral"}
          intensity={isPrimaryCta ? "catchy" : "quiet"}
          gridArea="button"
          type="button"
          alignSelf="center"
          size="large"
          onClick={() => {
            logSelfHostedSSOSetupStep({
              ssoSetupStep: SsoSetupStep.SetUpEncryptionServiceSettings,
            });
            history.push(`${parentPath}${encryptionServiceSubPath}`);
          }}
          isLoading={loading}
        >
          {esConfig ? translate(I18N_KEYS.EDIT) : translate(I18N_KEYS.SET_UP)}
        </GridChild>
        {esConfig ? (
          <GridChild gridArea="status" sx={{ mt: "20px" }}>
            <EncryptionServiceStatus config={esConfig} />
          </GridChild>
        ) : null}
      </GridContainer>
    </Card>
  );
};
