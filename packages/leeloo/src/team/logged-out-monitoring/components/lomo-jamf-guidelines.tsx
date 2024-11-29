import {
  Button,
  Card,
  DisplayArea,
  DisplayField,
  Flex,
  Icon,
  OsThumbnail,
  Paragraph,
  useToast,
} from "@dashlane/design-system";
import {
  RiskDetectionSetupStep,
  UserSetupRiskDetectionEvent,
} from "@dashlane/hermes";
import {
  type GetMassDeploymentSetupInformationQueryResult,
  JamfSetupInformationResult,
  type SupportedMassDeploymentBrowsers,
} from "@dashlane/risk-monitoring-contracts";
import useTranslate from "../../../libs/i18n/useTranslate";
import { logEvent } from "../../../libs/logs/logEvent";
import { LOMO_STYLES } from "../styles";
export const I18N_KEYS = {
  BUTTON_COPY_VALUE:
    "team_risk_detection_setup_guidelines_device_configuration_field_copy_button",
  TOAST_CLOSE: "team_risk_detection_setup_toast_close",
  TOAST_ERROR: "_common_generic_error",
  TOAST_VALUE_COPIED: "team_risk_detection_setup_status_value_copied_toast",
  MACOS_GUIDELINES_TITLE:
    "team_risk_detection_setup_guidelines_title_jamf_macos",
  MACOS_GUIDELINES_APPLY_POLICIES_PARAGRAPH_PART_ONE:
    "team_risk_detection_setup_guidelines_policies_paragraph_part_one_jamf_macos_markup",
  MACOS_GUIDELINES_APPLY_POLICIES_PARAGRAPH_PART_TWO:
    "team_risk_detection_setup_guidelines_policies_paragraph_part_two_jamf_macos_markup",
  MACOS_GUIDELINES_APPLY_POLICIES_PARAGRAPH_PART_THREE:
    "team_risk_detection_setup_guidelines_policies_paragraph_part_three_jamf_macos_markup",
  MACOS_GUIDELINES_FORCE_INSTALL_PARAGRAPH_PART_ONE:
    "team_risk_detection_setup_guidelines_force_install_paragraph_part_one_jamf_macos_markup",
  MACOS_GUIDELINES_FORCE_INSTALL_PARAGRAPH_PART_TWO:
    "team_risk_detection_setup_guidelines_force_install_paragraph_part_two_jamf_macos_markup",
  MACOS_GUIDELINES_FORCE_INSTALL_PARAGRAPH_PART_THREE:
    "team_risk_detection_setup_guidelines_force_install_paragraph_part_three_jamf_macos_markup",
  JAMF_PROPERTY_LIST_FIELDS_LABEL_GENERIC:
    "team_risk_detection_setup_guidelines_property_list_fields_label_generic",
  JAMF_PROPERTY_LIST_FIELDS_LABEL_CHROME:
    "team_risk_detection_setup_guidelines_property_list_fields_label_chrome",
  JAMF_PROPERTY_LIST_FIELDS_LABEL_EDGE:
    "team_risk_detection_setup_guidelines_property_list_fields_label_edge",
  JAMF_PROPERTY_LIST_FIELDS_LABEL_FIREFOX:
    "team_risk_detection_setup_guidelines_property_list_fields_label_firefox",
  JAMF_PREFERENCE_DOMAINS_FIELDS_LABEL_CHROME:
    "team_risk_detection_setup_guidelines_preference_domains_fields_label_chrome",
  JAMF_PREFERENCE_DOMAINS_FIELDS_LABEL_EDGE:
    "team_risk_detection_setup_guidelines_preference_domains_fields_label_edge",
  JAMF_PREFERENCE_DOMAINS_FIELDS_LABEL_FIREFOX:
    "team_risk_detection_setup_guidelines_preference_domains_fields_label_firefox",
  MACOS_GUIDELINES_APPLY_POLICIES_ESTIMATED_TIME:
    "ace_team_risk_detection_setup_guidelines_apply_policies_estimated_time_jamf",
  MACOS_GUIDELINES_FORCE_INSTALL_ESTIMATED_TIME:
    "ace_team_risk_detection_setup_guidelines_force_install_estimated_time_jamf",
};
const BROWSER_TO_PROPERTY_LIST_LABEL_KEY = {
  chrome: I18N_KEYS.JAMF_PROPERTY_LIST_FIELDS_LABEL_CHROME,
  edge: I18N_KEYS.JAMF_PROPERTY_LIST_FIELDS_LABEL_EDGE,
  firefox: I18N_KEYS.JAMF_PROPERTY_LIST_FIELDS_LABEL_FIREFOX,
};
const BROWSER_TO_PREFERENCE_DOMAINS_LABEL_KEY = {
  chrome: I18N_KEYS.JAMF_PREFERENCE_DOMAINS_FIELDS_LABEL_CHROME,
  edge: I18N_KEYS.JAMF_PREFERENCE_DOMAINS_FIELDS_LABEL_EDGE,
  firefox: I18N_KEYS.JAMF_PREFERENCE_DOMAINS_FIELDS_LABEL_FIREFOX,
};
const BROWSER_TO_POLICIES_USER_EVENT_LOG = {
  chrome: RiskDetectionSetupStep.CopyJamfPoliciesChromePreferenceDomain,
  edge: RiskDetectionSetupStep.CopyJamfPoliciesEdgePreferenceDomain,
  firefox:
    "copy_jamf_policies_firefox_preference_domain" as RiskDetectionSetupStep,
};
const BROWSER_TO_FORCE_INSTALL_PREFERENCE_DOMAIN_USER_EVENT_LOG = {
  chrome: RiskDetectionSetupStep.CopyJamfForceInstallChromePreferenceDomain,
  edge: RiskDetectionSetupStep.CopyJamfForceInstallEdgePreferenceDomain,
  firefox:
    "copy_jamf_force_install_firefox_preference_domain" as RiskDetectionSetupStep,
};
const BROWSER_TO_FORCE_INSTALL_PROPERTY_LIST_USER_EVENT_LOG = {
  chrome: RiskDetectionSetupStep.CopyJamfForceInstallChromePropertyList,
  edge: RiskDetectionSetupStep.CopyJamfForceInstallEdgePropertyList,
  firefox:
    "copy_jamf_force_install_firefox_property_list" as RiskDetectionSetupStep,
};
type LomoJamfDeploymentGuidelinesProps = {
  selectedBrowsers: SupportedMassDeploymentBrowsers[];
  setupInformation: GetMassDeploymentSetupInformationQueryResult;
};
export const LomoJamfDeploymentGuidelines = ({
  selectedBrowsers,
  setupInformation,
}: LomoJamfDeploymentGuidelinesProps) => {
  const { translate } = useTranslate();
  const { showToast } = useToast();
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
        <OsThumbnail type="apple" size="small" sx={{ marginRight: "8px" }} />
        {translate(I18N_KEYS.MACOS_GUIDELINES_TITLE)}
      </Flex>
      <Flex flexDirection="row" alignItems="center">
        <Paragraph>
          {translate.markup(
            I18N_KEYS.MACOS_GUIDELINES_APPLY_POLICIES_PARAGRAPH_PART_ONE
          )}
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
          {translate(I18N_KEYS.MACOS_GUIDELINES_APPLY_POLICIES_ESTIMATED_TIME)}
        </Paragraph>
      </Flex>
      <Paragraph>
        {translate.markup(
          I18N_KEYS.MACOS_GUIDELINES_APPLY_POLICIES_PARAGRAPH_PART_TWO
        )}
      </Paragraph>
      <Paragraph>
        {translate.markup(
          I18N_KEYS.MACOS_GUIDELINES_APPLY_POLICIES_PARAGRAPH_PART_THREE
        )}
      </Paragraph>
      {selectedBrowsers.map((browser) => {
        return (
          <div key={browser}>
            <Card sx={LOMO_STYLES.DISPLAY_FIELD_WHITE}>
              <DisplayField
                label={translate(
                  BROWSER_TO_PREFERENCE_DOMAINS_LABEL_KEY[browser]
                )}
                value={
                  (
                    setupInformation.massDeploymentSetupInformation as JamfSetupInformationResult
                  )?.extensionPreferenceDomains[browser]
                }
                actions={[
                  <Button
                    key="CopyValue"
                    intensity="supershy"
                    layout="iconLeading"
                    icon="ActionCopyOutlined"
                    onClick={handleClickOnCopy(
                      (
                        setupInformation.massDeploymentSetupInformation as JamfSetupInformationResult
                      )?.extensionPreferenceDomains[browser] ?? "",
                      translate(I18N_KEYS.TOAST_VALUE_COPIED),
                      BROWSER_TO_POLICIES_USER_EVENT_LOG[browser]
                    )}
                  >
                    {translate(I18N_KEYS.BUTTON_COPY_VALUE)}
                  </Button>,
                ]}
              />
            </Card>
          </div>
        );
      })}

      <Card sx={LOMO_STYLES.DISPLAY_FIELD_WHITE}>
        <DisplayArea
          label={translate(I18N_KEYS.JAMF_PROPERTY_LIST_FIELDS_LABEL_GENERIC)}
          value={
            (
              setupInformation.massDeploymentSetupInformation as JamfSetupInformationResult
            )?.extensionPoliciesValue
          }
          actions={[
            <Button
              key="CopyValue"
              intensity="supershy"
              layout="iconLeading"
              icon="ActionCopyOutlined"
              onClick={handleClickOnCopy(
                (
                  setupInformation.massDeploymentSetupInformation as JamfSetupInformationResult
                )?.extensionPoliciesValue ?? "",
                translate(I18N_KEYS.TOAST_VALUE_COPIED),
                RiskDetectionSetupStep.CopyJamfPoliciesPropertyList
              )}
            >
              {translate(I18N_KEYS.BUTTON_COPY_VALUE)}
            </Button>,
          ]}
        />
      </Card>

      <Flex flexDirection="row" alignItems="center">
        <Paragraph>
          {translate.markup(
            I18N_KEYS.MACOS_GUIDELINES_FORCE_INSTALL_PARAGRAPH_PART_ONE
          )}
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
          {translate(I18N_KEYS.MACOS_GUIDELINES_FORCE_INSTALL_ESTIMATED_TIME)}
        </Paragraph>
      </Flex>
      <Paragraph>
        {translate.markup(
          I18N_KEYS.MACOS_GUIDELINES_FORCE_INSTALL_PARAGRAPH_PART_TWO
        )}
      </Paragraph>
      <Paragraph>
        {translate.markup(
          I18N_KEYS.MACOS_GUIDELINES_FORCE_INSTALL_PARAGRAPH_PART_THREE
        )}
      </Paragraph>

      {selectedBrowsers.map((browser) => (
        <div key={`jamf-force-install-guidelines-${browser}`}>
          <Card sx={LOMO_STYLES.DISPLAY_FIELD_WHITE}>
            <DisplayField
              label={translate(
                BROWSER_TO_PREFERENCE_DOMAINS_LABEL_KEY[browser]
              )}
              value={
                (
                  setupInformation.massDeploymentSetupInformation as JamfSetupInformationResult
                )?.browsersPreferenceDomains[browser]
              }
              actions={[
                <Button
                  key="CopyToken"
                  intensity="supershy"
                  layout="iconLeading"
                  icon="ActionCopyOutlined"
                  onClick={handleClickOnCopy(
                    (
                      setupInformation.massDeploymentSetupInformation as JamfSetupInformationResult
                    )?.browsersPreferenceDomains[browser] ?? "",
                    translate(I18N_KEYS.TOAST_VALUE_COPIED),
                    BROWSER_TO_FORCE_INSTALL_PREFERENCE_DOMAIN_USER_EVENT_LOG[
                      browser
                    ]
                  )}
                >
                  {translate(I18N_KEYS.BUTTON_COPY_VALUE)}
                </Button>,
              ]}
            />
          </Card>
          <Card sx={{ ...LOMO_STYLES.DISPLAY_FIELD_WHITE, marginTop: "16px" }}>
            <DisplayArea
              label={translate(BROWSER_TO_PROPERTY_LIST_LABEL_KEY[browser])}
              value={
                (
                  setupInformation.massDeploymentSetupInformation as JamfSetupInformationResult
                )?.browsersForceInstallValues[browser]
              }
              actions={[
                <Button
                  key="CopyValue"
                  intensity="supershy"
                  layout="iconLeading"
                  icon="ActionCopyOutlined"
                  onClick={handleClickOnCopy(
                    (
                      setupInformation.massDeploymentSetupInformation as JamfSetupInformationResult
                    )?.browsersForceInstallValues[browser] ?? "",
                    translate(I18N_KEYS.TOAST_VALUE_COPIED),
                    BROWSER_TO_FORCE_INSTALL_PROPERTY_LIST_USER_EVENT_LOG[
                      browser
                    ]
                  )}
                >
                  {translate(I18N_KEYS.BUTTON_COPY_VALUE)}
                </Button>,
              ]}
            />
          </Card>
        </div>
      ))}
    </>
  );
};
export default LomoJamfDeploymentGuidelines;
