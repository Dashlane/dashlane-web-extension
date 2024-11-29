import {
  Button,
  Card,
  DisplayField,
  Flex,
  Icon,
  Infobox,
  OsThumbnail,
  Paragraph,
  useToast,
} from "@dashlane/design-system";
import { useModuleCommands } from "@dashlane/framework-react";
import {
  RiskDetectionSetupStep,
  UserSetupRiskDetectionEvent,
} from "@dashlane/hermes";
import {
  type GetMassDeploymentSetupInformationQueryResult,
  IntuneSetupInformationResult,
  loggedOutMonitoringApi,
  type SupportedMassDeploymentBrowsers,
} from "@dashlane/risk-monitoring-contracts";
import useTranslate from "../../../libs/i18n/useTranslate";
import { logEvent } from "../../../libs/logs/logEvent";
import { LOMO_STYLES } from "../styles";
export const I18N_KEYS = {
  BUTTON_COPY_TOKEN:
    "team_risk_detection_setup_guidelines_token_field_copy_button",
  BUTTON_COPY_VALUE:
    "team_risk_detection_setup_guidelines_device_configuration_field_copy_button",
  BUTTON_DOWNLOAD:
    "team_risk_detection_setup_guidelines_script_field_download_button",
  FIELD_SCRIPT: "team_risk_detection_setup_guidelines_script_field_title",
  FIELD_TOKEN: "team_risk_detection_setup_guidelines_token_field_title",
  INFOBOX_CHROME_ADMX_TITLE:
    "team_risk_detection_setup_guidelines_import_admx_infobox_markup",
  TOAST_CLOSE: "team_risk_detection_setup_toast_close",
  TOAST_DOWNLOAD_ERROR_DESCRIPTION:
    "team_risk_detection_setup_download_error_description",
  TOAST_DOWNLOAD_ERROR_RETRY: "team_risk_detection_setup_download_error_retry",
  TOAST_ERROR: "_common_generic_error",
  TOAST_TOKEN_COPIED: "team_risk_detection_setup_status_token_copied_toast",
  TOAST_VALUE_COPIED: "team_risk_detection_setup_status_value_copied_toast",
  WINDOWS_GUIDELINES_TITLE:
    "team_risk_detection_setup_guidelines_title_intune_windows",
  WINDOWS_GUIDELINES_APPLY_POLICIES_PARAGRAPH:
    "team_risk_detection_setup_guidelines_policies_paragraph_intune_windows_markup",
  WINDOWS_GUIDELINES_FORCE_INSTALL_PARAGRAPH:
    "team_risk_detection_setup_guidelines_force_install_paragraph_intune_windows_markup",
  WINDOWS_GUIDELINES_EXTENSION_ID_UPDATE_URL_LABEL_CHROME:
    "team_risk_detection_setup_guidelines_extension_id_update_url_label_chrome",
  WINDOWS_GUIDELINES_EXTENSION_ID_UPDATE_URL_LABEL_EDGE:
    "team_risk_detection_setup_guidelines_extension_id_update_url_label_edge",
  WINDOWS_GUIDELINES_APPLY_POLICIES_TITLE:
    "team_risk_detection_setup_guidelines_policies_paragraph_title_intune_markup",
  WINDOWS_GUIDELINES_FORCE_INSTALL_TITLE:
    "team_risk_detection_setup_guidelines_force_install_paragraph_title_intune_markup",
  WARNING_CONFIRM_POLICIES_DEPLOYED_TITLE:
    "ace_team_risk_detection_setup_policies_verify_deployment_warning_title",
  WARNING_CONFIRM_POLICIES_DEPLOYED_DESCRIPTION:
    "ace_team_risk_detection_setup_policies_verify_deployment_warning_description_markup",
  WINDOWS_GUIDELINES_APPLY_POLICIES_ESTIMATED_TIME:
    "ace_team_risk_detection_setup_guidelines_policies_paragraph_estimated_time_intune",
  WINDOWS_GUIDELINES_FORCE_INSTALL_ESTIMATED_TIME:
    "ace_team_risk_detection_setup_guidelines_force_install_paragraph_estimated_time_intune",
};
const BROWSER_TO_DISPLAY_NAME_KEY = {
  chrome: I18N_KEYS.WINDOWS_GUIDELINES_EXTENSION_ID_UPDATE_URL_LABEL_CHROME,
  edge: I18N_KEYS.WINDOWS_GUIDELINES_EXTENSION_ID_UPDATE_URL_LABEL_EDGE,
  firefox: "firefox",
};
const BROWSER_TO_UPDATE_URL_USER_EVENT_LOG = {
  chrome: RiskDetectionSetupStep.CopyIntuneChromeDeviceValue,
  edge: RiskDetectionSetupStep.CopyIntuneEdgeDeviceValue,
  firefox: "copy_intune_firefox_device_value" as RiskDetectionSetupStep,
};
type LomoIntuneDeploymentGuidelinesProps = {
  selectedBrowsers: SupportedMassDeploymentBrowsers[];
  setupInformation: GetMassDeploymentSetupInformationQueryResult;
};
export const LomoIntuneDeploymentGuidelines = ({
  selectedBrowsers,
  setupInformation,
}: LomoIntuneDeploymentGuidelinesProps) => {
  const { translate } = useTranslate();
  const { showToast } = useToast();
  const { generateAndDownloadMassDeploymentScript } = useModuleCommands(
    loggedOutMonitoringApi
  );
  const handleOnDownloadScriptClicked = async () => {
    try {
      await generateAndDownloadMassDeploymentScript({
        targetedBrowsers: selectedBrowsers,
        targetedMassDeploymentSoftware: "microsoft-intune",
        targetedOS: "windows",
      });
      logEvent(
        new UserSetupRiskDetectionEvent({
          riskDetectionSetupStep:
            RiskDetectionSetupStep.DownloadIntuneScriptFile,
        })
      );
    } catch {
      showToast({
        mood: "danger",
        description: translate(I18N_KEYS.TOAST_DOWNLOAD_ERROR_DESCRIPTION),
        closeActionLabel: translate(I18N_KEYS.TOAST_CLOSE),
        action: {
          onClick: handleOnDownloadScriptClicked,
          label: translate(I18N_KEYS.TOAST_DOWNLOAD_ERROR_RETRY),
        },
      });
    }
  };
  const handleClickOnCopy =
    (
      textToBeCopied: string,
      successToast: string,
      eventToSend: RiskDetectionSetupStep
    ) =>
    async () => {
      try {
        await navigator.clipboard.writeText(textToBeCopied);
        showToast({
          description: successToast,
          closeActionLabel: translate(I18N_KEYS.TOAST_CLOSE),
        });
        logEvent(
          new UserSetupRiskDetectionEvent({
            riskDetectionSetupStep: eventToSend,
          })
        );
      } catch {
        showToast({
          mood: "danger",
          description: translate(I18N_KEYS.TOAST_ERROR),
          closeActionLabel: translate(I18N_KEYS.TOAST_CLOSE),
        });
      }
    };
  return (
    <>
      <Flex
        alignItems="center"
        color="ds.text.neutral.catchy"
        id="intune-guidelines"
        aria-labelledby="intune-tab"
      >
        <OsThumbnail type="windows" size="small" sx={{ marginRight: "8px" }} />
        {translate(I18N_KEYS.WINDOWS_GUIDELINES_TITLE)}
      </Flex>
      <Flex flexDirection="row" alignItems="center">
        <Paragraph>
          {translate.markup(I18N_KEYS.WINDOWS_GUIDELINES_APPLY_POLICIES_TITLE)}
        </Paragraph>
        <Icon
          name="TimeOutlined"
          size="xsmall"
          color="ds.text.neutral.quiet"
          sx={{ marginLeft: "8px" }}
        />
        <Paragraph
          textStyle="ds.body.helper.regular"
          color="ds.text.neutral.quiet"
          sx={{ marginLeft: "2px" }}
        >
          {translate(
            I18N_KEYS.WINDOWS_GUIDELINES_APPLY_POLICIES_ESTIMATED_TIME
          )}
        </Paragraph>
      </Flex>
      <Paragraph>
        {translate.markup(
          I18N_KEYS.WINDOWS_GUIDELINES_APPLY_POLICIES_PARAGRAPH
        )}
      </Paragraph>
      <Card sx={LOMO_STYLES.DISPLAY_FIELD_WHITE}>
        <DisplayField
          label={translate(I18N_KEYS.FIELD_SCRIPT)}
          value="Dashlane-Risk-Detection-Policies-Script.ps1"
          actions={[
            <Button
              key="DownloadScript"
              intensity="supershy"
              layout="iconLeading"
              icon="DownloadOutlined"
              onClick={handleOnDownloadScriptClicked}
            >
              {translate(I18N_KEYS.BUTTON_DOWNLOAD)}
            </Button>,
          ]}
        />
      </Card>
      <Card sx={LOMO_STYLES.DISPLAY_FIELD_WHITE}>
        <DisplayField
          label={translate(I18N_KEYS.FIELD_TOKEN)}
          value={setupInformation.massDeploymentTeamKey}
          actions={[
            <Button
              key="CopyToken"
              intensity="supershy"
              layout="iconLeading"
              icon="ActionCopyOutlined"
              onClick={handleClickOnCopy(
                setupInformation.massDeploymentTeamKey ?? "",
                translate(I18N_KEYS.TOAST_TOKEN_COPIED),
                RiskDetectionSetupStep.CopyIntuneConfigurationToken
              )}
            >
              {translate(I18N_KEYS.BUTTON_COPY_TOKEN)}
            </Button>,
          ]}
        />
      </Card>
      <Flex flexDirection="row" alignItems="center">
        <Paragraph>
          {translate.markup(I18N_KEYS.WINDOWS_GUIDELINES_FORCE_INSTALL_TITLE)}
        </Paragraph>
        <Icon
          name="TimeOutlined"
          size="xsmall"
          color="ds.text.neutral.quiet"
          sx={{ marginLeft: "8px" }}
        />
        <Paragraph
          textStyle="ds.body.helper.regular"
          color="ds.text.neutral.quiet"
          sx={{ marginLeft: "2px" }}
        >
          {translate(I18N_KEYS.WINDOWS_GUIDELINES_FORCE_INSTALL_ESTIMATED_TIME)}
        </Paragraph>
      </Flex>
      <Infobox
        title={translate(I18N_KEYS.WARNING_CONFIRM_POLICIES_DEPLOYED_TITLE)}
        description={translate.markup(
          I18N_KEYS.WARNING_CONFIRM_POLICIES_DEPLOYED_DESCRIPTION
        )}
        mood="warning"
        size="large"
        icon="FeedbackWarningOutlined"
      />
      <Paragraph>
        {translate.markup(I18N_KEYS.WINDOWS_GUIDELINES_FORCE_INSTALL_PARAGRAPH)}
      </Paragraph>
      {selectedBrowsers.map((browser) => (
        <div key={browser}>
          <Card sx={LOMO_STYLES.DISPLAY_FIELD_WHITE}>
            <DisplayField
              label={translate(BROWSER_TO_DISPLAY_NAME_KEY[browser])}
              value={
                (
                  setupInformation.massDeploymentSetupInformation as IntuneSetupInformationResult
                )?.massDeploymentExtensionIDsAndUpdateURLs[browser]
              }
              actions={[
                <Button
                  key="CopyValue"
                  intensity="supershy"
                  layout="iconLeading"
                  icon="ActionCopyOutlined"
                  onClick={handleClickOnCopy(
                    (
                      setupInformation.massDeploymentSetupInformation as IntuneSetupInformationResult
                    )?.massDeploymentExtensionIDsAndUpdateURLs[browser] ?? "",
                    translate(I18N_KEYS.TOAST_VALUE_COPIED),
                    BROWSER_TO_UPDATE_URL_USER_EVENT_LOG[browser]
                  )}
                >
                  {translate(I18N_KEYS.BUTTON_COPY_VALUE)}
                </Button>,
              ]}
            />
          </Card>
          {browser === "chrome" ? (
            <div
              onClick={() =>
                logEvent(
                  new UserSetupRiskDetectionEvent({
                    riskDetectionSetupStep:
                      RiskDetectionSetupStep.ClickChromeAdmxLink,
                  })
                )
              }
            >
              <Infobox
                icon="FeedbackInfoOutlined"
                title={translate.markup(I18N_KEYS.INFOBOX_CHROME_ADMX_TITLE)}
                sx={{ marginTop: "16px" }}
              />
            </div>
          ) : null}
        </div>
      ))}
    </>
  );
};
