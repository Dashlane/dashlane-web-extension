import {
  Badge,
  Button,
  Card,
  DomainThumbnail,
  Heading,
  IndeterminateLoader,
  Paragraph,
} from "@dashlane/design-system";
import {
  DataStatus,
  useFeatureFlip,
  useModuleCommands,
  useModuleQuery,
} from "@dashlane/framework-react";
import { isSuccess } from "@dashlane/framework-types";
import {
  IntegrationPlatform,
  NudgeAction,
  UserSetupNudgesEvent,
} from "@dashlane/hermes";
import {
  DefaultNudgeOptions,
  nudgesApi,
  NudgeType,
  TeamNudge,
  UpdateTeamNudgeCommandParam,
} from "@dashlane/risk-mitigation-contracts";
import { AlertSeverity, GridContainer } from "@dashlane/ui-components";
import { useAlert } from "../../../libs/alert-notifications/use-alert";
import useTranslate from "../../../libs/i18n/useTranslate";
import { useAlertQueue } from "../../alerts/use-alert-queue";
import { ResponsiveMainSecondaryLayout } from "../components/layout/responsive-main-secondary-layout";
import slackLogo from "./assets/slack.png";
import { Nudge } from "./nudge";
import { NudgesHelpCard } from "./nudges-help-card";
import { logEvent } from "../../../libs/logs/logEvent";
import { UpsellCard } from "../../components/upsell-card";
import { FeatureType } from "../../helpers/open-business-upgrade-url";
import { useIsBusinessPlus } from "../../helpers/use-is-business-plus";
const I18N_KEYS = {
  CONTAINER_TITLE: "team_settings_nudges_setup_container_title",
  UNINSTALL: "team_settings_nudges_uninstall",
  UNINSTALL_ERROR: "team_settings_nudges_uninstall_error",
  UNINSTALL_SUCCESS: "team_settings_nudges_uninstall_success",
  SCHEDULE_TITLE: "team_settings_nudges_configuration_schedule_title",
  UNKNOWN_ERROR: "_common_generic_error",
  GET_NUDGES_ERROR: "team_settings_nudges_configuration_get_nudges_error",
  UPDATE_NUDGE_ERROR: "team_settings_nudges_configuration_update_nudge_error",
  UPDATE_NUDGE_SUCCESS:
    "team_settings_nudges_configuration_update_nudge_success",
  SEND_NUDGE_ERROR: "team_settings_nudges_configuration_send_nudge_error",
  SEND_NUDGE_SUCCESS: "team_settings_nudges_configuration_send_nudge_success",
  STATUS_TITLE: "team_settings_nudges_configuration_status",
  STATUS_VALUE: "team_settings_nudges_configuration_status_value",
};
interface NudgeConfig {
  type: NudgeType;
  options?: DefaultNudgeOptions;
  existingNudge?: TeamNudge;
}
export const NudgesConfigurations = () => {
  const hasUninstallNudgesFF = useFeatureFlip("ace_nudges_uninstall_slack");
  const teamNudgesResult = useModuleQuery(nudgesApi, "getTeamNudges");
  const { sendNudge, updateTeamNudge, uninstallNudges } =
    useModuleCommands(nudgesApi);
  const isBusinessPlus = useIsBusinessPlus();
  const alert = useAlert();
  const { translate } = useTranslate();
  const { reportTACError } = useAlertQueue();
  const updateNudge = async (params: UpdateTeamNudgeCommandParam) => {
    try {
      const sendResult = await updateTeamNudge(params);
      if (isSuccess(sendResult)) {
        alert.showAlert(
          translate(I18N_KEYS.UPDATE_NUDGE_SUCCESS),
          AlertSeverity.SUCCESS
        );
        return;
      }
      alert.showAlert(
        translate(I18N_KEYS.UPDATE_NUDGE_ERROR),
        AlertSeverity.ERROR
      );
    } catch (err) {
      alert.showAlert(translate(I18N_KEYS.UNKNOWN_ERROR), AlertSeverity.ERROR);
    }
  };
  const sendTestNudge = async (type: NudgeType) => {
    try {
      const sendResult = await sendNudge({ type });
      if (isSuccess(sendResult)) {
        logEvent(
          new UserSetupNudgesEvent({
            action: NudgeAction.SentTestNudge,
            integrationPlatform: IntegrationPlatform.Slack,
          })
        );
        alert.showAlert(
          translate(I18N_KEYS.SEND_NUDGE_SUCCESS),
          AlertSeverity.SUCCESS
        );
        return;
      }
      alert.showAlert(
        translate(I18N_KEYS.SEND_NUDGE_ERROR),
        AlertSeverity.ERROR
      );
    } catch (err) {
      alert.showAlert(translate(I18N_KEYS.UNKNOWN_ERROR), AlertSeverity.ERROR);
    }
  };
  const removeNudges = async () => {
    try {
      const uninstallResult = await uninstallNudges();
      if (isSuccess(uninstallResult)) {
        logEvent(
          new UserSetupNudgesEvent({
            action: NudgeAction.UninstalledIntegration,
            integrationPlatform: IntegrationPlatform.Slack,
          })
        );
        alert.showAlert(
          translate(I18N_KEYS.UNINSTALL_SUCCESS),
          AlertSeverity.SUCCESS
        );
        return;
      }
      alert.showAlert(
        translate(I18N_KEYS.UNINSTALL_ERROR),
        AlertSeverity.ERROR
      );
    } catch (err) {
      alert.showAlert(translate(I18N_KEYS.UNKNOWN_ERROR), AlertSeverity.ERROR);
    }
  };
  if (teamNudgesResult.status === DataStatus.Loading) {
    return (
      <div sx={{ display: "flex", justifyContent: "center" }}>
        <IndeterminateLoader size={75} />
      </div>
    );
  }
  if (teamNudgesResult.status === DataStatus.Error) {
    reportTACError(new Error(translate(I18N_KEYS.GET_NUDGES_ERROR)));
  }
  const nudgesAvailable: NudgeConfig[] | undefined =
    teamNudgesResult.data?.defaultNudges
      .map(({ displayName, options }) => {
        switch (displayName) {
          case "compromised_passwords":
          case "reused_passwords":
          case "weak_passwords":
            return {
              type: displayName,
              options,
              existingNudge: teamNudgesResult.data.teamNudges.find(
                ({ nudge }) => nudge === displayName
              ),
            };
          default:
            return { type: undefined };
        }
      })
      .filter((nudge): nudge is NudgeConfig => !!nudge.type);
  return (
    <ResponsiveMainSecondaryLayout
      sx={{ padding: "0 32px" }}
      fullWidth
      mainContent={
        <div sx={{ display: "flex", flexDirection: "column", gap: "24px 0" }}>
          <Card
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: "16px",
              backgroundColor: "ds.container.agnostic.neutral.supershy",
              borderColor: "ds.border.neutral.quiet.idle",
            }}
          >
            <Heading as="h2" color="ds.text.neutral.catchy">
              {translate(I18N_KEYS.CONTAINER_TITLE)}
            </Heading>
            <div
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                flex: 1,
                backgroundColor: "ds.container.agnostic.neutral.standard",
                borderColor: "ds.border.neutral.standard.idle",
                padding: "40px",
                borderRadius: "8px",
              }}
            >
              <div>
                <Paragraph
                  color="ds.text.neutral.standard"
                  textStyle="ds.title.supporting.small"
                  sx={{ marginBottom: "8px" }}
                >
                  {translate(I18N_KEYS.STATUS_TITLE)}
                </Paragraph>
                <Badge
                  label={translate(I18N_KEYS.STATUS_VALUE)}
                  layout="labelOnly"
                  mood="positive"
                />
              </div>
              {hasUninstallNudgesFF ? (
                <Button
                  mood="danger"
                  intensity="supershy"
                  size="small"
                  onClick={removeNudges}
                >
                  {translate(I18N_KEYS.UNINSTALL)}
                </Button>
              ) : null}
            </div>
          </Card>
          <Card
            sx={{
              backgroundColor: "ds.container.agnostic.neutral.supershy",
              borderColor: "ds.border.neutral.quiet.idle",
            }}
          >
            <div sx={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <DomainThumbnail
                domainLogoURL={slackLogo}
                backgroundColor="#FFFFFF"
              />
              <Heading as="h2" color="ds.text.neutral.catchy">
                {translate(I18N_KEYS.SCHEDULE_TITLE)}
              </Heading>
            </div>
            <hr
              sx={{
                width: "100%",
                borderTopWidth: "1px",
                borderTopStyle: "solid",
                borderColor: "ds.border.neutral.quiet.idle",
                marginTop: "24px",
                marginBottom: "24px",
              }}
            />
            {nudgesAvailable
              ? nudgesAvailable.map(
                  ({ type, options, existingNudge }, index) => (
                    <Nudge
                      key={`${type}-${index}`}
                      updateNudge={updateNudge}
                      sendTestNudge={sendTestNudge}
                      displayName={type}
                      dropdownOptions={options}
                      existingNudge={existingNudge}
                    />
                  )
                )
              : null}
          </Card>
        </div>
      }
      secondaryContent={
        <GridContainer gap="16px">
          <NudgesHelpCard />
          {!isBusinessPlus ? (
            <UpsellCard featureType={FeatureType.Nudges} />
          ) : null}
        </GridContainer>
      }
    />
  );
};
