import { useState } from "react";
import {
  Card,
  Flex,
  Heading,
  Icon,
  IndeterminateLoader,
  Infobox,
  mergeSx,
  Paragraph,
  type TabConfiguration,
  Tabs,
} from "@dashlane/design-system";
import {
  isIntuneSetupInformationResult,
  isJamfSetupInformationResult,
  type SupportedMassDeploymentBrowsers,
  type SupportedMassDeploymentSoftwares,
} from "@dashlane/risk-monitoring-contracts";
import useTranslate from "../../../libs/i18n/useTranslate";
import { useLOMoSetupInformation } from "../hooks/use-lomo-setup-information";
import type { LoggedOutMonitoringErrorProps } from "../logged-out-monitoring";
import { LomoBrowserSelectionCheckboxes } from "./lomo-deployment-software-checkboxes-card";
import { LomoIntuneDeploymentGuidelines } from "./lomo-intune-guidelines";
import LomoJamfDeploymentGuidelines from "./lomo-jamf-guidelines";
import { LOMO_STYLES } from "../styles";
type LomoDeploymentGuidelinesCardLayoutProps = {
  title: string;
  isCollapsible?: boolean;
  setError: (props: LoggedOutMonitoringErrorProps) => void;
};
export const I18N_KEYS = {
  MASS_DEPLOYMENT_ESTIMATED_TIME:
    "ace_team_risk_detection_setup_estimated_time",
  MASS_DEPLOYMENT_GUIDELINES_HEADER:
    "team_risk_detection_setup_guidelines_title",
  MASS_DEPLOYMENT_GUIDELINES_SUBHEADER:
    "team_risk_detection_setup_guidelines_subtitle",
  DEPLOYMENT_SOFTWARE_INTUNE:
    "team_risk_detection_setup_deployment_method_deployment_software_option_intune",
  DEPLOYMENT_SOFTWARE_JAMF:
    "team_risk_detection_setup_deployment_method_deployment_software_option_jamf",
  SETUP_POLICIES_BEFORE_EXTENSION_WARNING_TITLE:
    "ace_team_risk_detection_setup_warning_title",
  SETUP_POLICIES_BEFORE_EXTENSION_WARNING_DESCRIPTION:
    "ace_team_risk_detection_setup_warning_description",
};
export const LomoDeploymentGuidelinesCardLayout = ({
  title,
  isCollapsible = false,
  setError,
}: LomoDeploymentGuidelinesCardLayoutProps) => {
  const [selectedMassDeploymentSoftware, setSelectedMassDeploymentSoftware] =
    useState<SupportedMassDeploymentSoftwares>("microsoft-intune");
  const [selectedBrowsers, setSelectedBrowsers] = useState<
    SupportedMassDeploymentBrowsers[]
  >(["chrome"]);
  const [setupDetailsCollapsed, setSetupDetailsCollapsed] = useState(true);
  const { translate } = useTranslate();
  const LOMoSetupInformation = useLOMoSetupInformation({
    targetedMassDeploymentBrowsers: selectedBrowsers,
    targetedMassDeploymentSoftware: selectedMassDeploymentSoftware,
    targetedMassDeploymentOS:
      selectedMassDeploymentSoftware === "microsoft-intune"
        ? "windows"
        : "macos",
  });
  const massDeploymentSoftwaresTabs: TabConfiguration[] = [
    {
      contentId: "intune-guidelines",
      title: translate(I18N_KEYS.DEPLOYMENT_SOFTWARE_INTUNE),
      id: "intune-tab",
      onSelect: () => setSelectedMassDeploymentSoftware("microsoft-intune"),
    },
    {
      contentId: "jamf-guidelines",
      title: translate(I18N_KEYS.DEPLOYMENT_SOFTWARE_JAMF),
      id: "jamf-tab",
      onSelect: () => setSelectedMassDeploymentSoftware("jamf"),
    },
  ];
  if (LOMoSetupInformation.isLoading) {
    return <IndeterminateLoader />;
  } else if (LOMoSetupInformation.isError) {
    setError({
      hasError: true,
      retryFunction: () =>
        setError({ hasError: false, retryFunction: undefined }),
    });
    return null;
  }
  const renderRightGuidelines = () => {
    if (
      selectedMassDeploymentSoftware === "microsoft-intune" &&
      isIntuneSetupInformationResult(
        LOMoSetupInformation.massDeploymentSetupInformation
      )
    ) {
      return (
        <LomoIntuneDeploymentGuidelines
          selectedBrowsers={selectedBrowsers}
          setupInformation={{
            massDeploymentSetupInformation:
              LOMoSetupInformation.massDeploymentSetupInformation,
            massDeploymentTeamKey: LOMoSetupInformation.massDeploymentTeamKey,
          }}
        />
      );
    } else if (
      selectedMassDeploymentSoftware === "jamf" &&
      isJamfSetupInformationResult(
        LOMoSetupInformation.massDeploymentSetupInformation
      )
    ) {
      return (
        <LomoJamfDeploymentGuidelines
          selectedBrowsers={selectedBrowsers}
          setupInformation={{
            massDeploymentSetupInformation:
              LOMoSetupInformation.massDeploymentSetupInformation,
            massDeploymentTeamKey: LOMoSetupInformation.massDeploymentTeamKey,
          }}
        />
      );
    }
    return null;
  };
  if (!isCollapsible) {
    return (
      <Card>
        <Infobox
          title={translate(
            I18N_KEYS.SETUP_POLICIES_BEFORE_EXTENSION_WARNING_TITLE
          )}
          mood="warning"
          description={translate(
            I18N_KEYS.SETUP_POLICIES_BEFORE_EXTENSION_WARNING_DESCRIPTION
          )}
          size="large"
        />
        <Paragraph
          textStyle="ds.title.supporting.small"
          color="ds.text.neutral.quiet"
          sx={{ marginTop: "8px" }}
        >
          {title}
        </Paragraph>
        <Flex flexDirection="row" alignItems="center">
          <Heading as="h1" textStyle="ds.title.section.medium">
            {translate(I18N_KEYS.MASS_DEPLOYMENT_GUIDELINES_HEADER)}
          </Heading>
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
            {translate(I18N_KEYS.MASS_DEPLOYMENT_ESTIMATED_TIME)}
          </Paragraph>
        </Flex>
        <Paragraph textStyle="ds.title.block.medium">
          {translate(I18N_KEYS.MASS_DEPLOYMENT_GUIDELINES_SUBHEADER)}
        </Paragraph>
        <Tabs fullWidth tabs={massDeploymentSoftwaresTabs} defaultTab={0} />
        <LomoBrowserSelectionCheckboxes
          selectedBrowsers={selectedBrowsers}
          setSelectedBrowsers={setSelectedBrowsers}
        />
        <Card sx={mergeSx([LOMO_STYLES.SUBCARD, { minHeight: "524px" }])}>
          {renderRightGuidelines()}
        </Card>
      </Card>
    );
  } else {
    return (
      <Card>
        <Flex
          as="button"
          flexDirection="row"
          alignItems="center"
          gap="8px"
          onClick={() => setSetupDetailsCollapsed(!setupDetailsCollapsed)}
          sx={{ cursor: "pointer", background: "none", width: "fit-content" }}
        >
          <Heading
            as="h3"
            textStyle="ds.title.supporting.small"
            color="ds.text.neutral.quiet"
          >
            {title}
          </Heading>
          <Icon
            name={
              setupDetailsCollapsed ? "CaretRightOutlined" : "CaretDownOutlined"
            }
            size="small"
            color="ds.text.neutral.quiet"
          />
        </Flex>
        {!setupDetailsCollapsed ? (
          <Flex flexDirection="column" gap="16px">
            <Flex flexDirection="row" alignItems="center">
              <Heading as="h1" textStyle="ds.title.section.medium">
                {translate(I18N_KEYS.MASS_DEPLOYMENT_GUIDELINES_HEADER)}
              </Heading>
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
                {translate(I18N_KEYS.MASS_DEPLOYMENT_ESTIMATED_TIME)}
              </Paragraph>
            </Flex>
            <Paragraph textStyle="ds.title.block.medium">
              {translate(I18N_KEYS.MASS_DEPLOYMENT_GUIDELINES_SUBHEADER)}
            </Paragraph>
            <Tabs fullWidth tabs={massDeploymentSoftwaresTabs} defaultTab={0} />
            <LomoBrowserSelectionCheckboxes
              selectedBrowsers={selectedBrowsers}
              setSelectedBrowsers={setSelectedBrowsers}
            />
            <Card sx={mergeSx([LOMO_STYLES.SUBCARD, { minHeight: "524px" }])}>
              {renderRightGuidelines()}
            </Card>
          </Flex>
        ) : null}
      </Card>
    );
  }
};
