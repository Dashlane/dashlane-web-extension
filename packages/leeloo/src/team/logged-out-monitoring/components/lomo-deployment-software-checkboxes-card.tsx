import {
  Card,
  Checkbox,
  Flex,
  mergeSx,
  Paragraph,
} from "@dashlane/design-system";
import type { SupportedMassDeploymentBrowsers } from "@dashlane/risk-monitoring-contracts";
import useTranslate from "../../../libs/i18n/useTranslate";
import { LOMO_STYLES } from "../styles";
export const I18N_KEYS = {
  BROWSER_SELECTION_CARD_TITLE:
    "team_risk_detection_setup_guidelines_browser_selection_card_title",
  BROWSER_SELECTION_CARD_SUBTITLE:
    "team_risk_detection_setup_guidelines_browser_selection_card_subtitle",
  BROWSER_CHROME:
    "team_risk_detection_setup_deployment_method_browser_option_chrome",
  BROWSER_EDGE:
    "team_risk_detection_setup_deployment_method_browser_option_edge",
  BROWSER_FIREFOX:
    "team_risk_detection_setup_deployment_method_browser_option_firefox",
};
type LomoBrowserSelectionCheckboxesProps = {
  selectedBrowsers: SupportedMassDeploymentBrowsers[];
  setSelectedBrowsers: (browsers: SupportedMassDeploymentBrowsers[]) => void;
};
export const LomoBrowserSelectionCheckboxes = ({
  selectedBrowsers,
  setSelectedBrowsers,
}: LomoBrowserSelectionCheckboxesProps) => {
  const { translate } = useTranslate();
  const handleBrowserSelectionCheckboxChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (
      !selectedBrowsers.includes(
        event.target.value as SupportedMassDeploymentBrowsers
      )
    ) {
      setSelectedBrowsers([
        ...selectedBrowsers,
        event.target.value as SupportedMassDeploymentBrowsers,
      ]);
    } else {
      const updatedSelectedBrowsers = selectedBrowsers.filter(
        (browser) => browser !== event.target.value
      );
      if (updatedSelectedBrowsers.length === 0) {
        setSelectedBrowsers(["chrome"]);
      } else {
        setSelectedBrowsers(updatedSelectedBrowsers);
      }
    }
  };
  return (
    <Card sx={mergeSx([LOMO_STYLES.SUBCARD, { gap: "unset" }])}>
      <Paragraph
        textStyle="ds.title.block.medium"
        color="ds.text.neutral.catchy"
        sx={{ marginBottom: "4px" }}
      >
        {translate(I18N_KEYS.BROWSER_SELECTION_CARD_TITLE)}
      </Paragraph>
      <Paragraph
        textStyle="ds.body.reduced.regular"
        color="ds.text.neutral.quiet"
        sx={{ marginBottom: "8px" }}
      >
        {translate(I18N_KEYS.BROWSER_SELECTION_CARD_SUBTITLE)}
      </Paragraph>
      <Flex justifyContent="space-between" sx={{ paddingX: "8px" }}>
        <Checkbox
          label={translate(I18N_KEYS.BROWSER_CHROME)}
          checked={selectedBrowsers.includes("chrome")}
          value="chrome"
          onChange={handleBrowserSelectionCheckboxChange}
        />
        <Checkbox
          label={translate(I18N_KEYS.BROWSER_EDGE)}
          checked={selectedBrowsers.includes("edge")}
          value="edge"
          onChange={handleBrowserSelectionCheckboxChange}
        />
        <Checkbox
          disabled
          label={translate(I18N_KEYS.BROWSER_FIREFOX)}
          checked={false}
          value="firefox"
        />
      </Flex>
    </Card>
  );
};
