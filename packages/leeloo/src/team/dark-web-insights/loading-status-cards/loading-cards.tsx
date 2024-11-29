import { Card, IndeterminateLoader } from "@dashlane/design-system";
import { colors, Paragraph, ThemeUIStyleObject } from "@dashlane/ui-components";
import useTranslate from "../../../libs/i18n/useTranslate";
const I18N_KEYS = {
  SCANNING_INCIDENTS_TXT: "team_dark_web_insights_scanning_incidents_txt",
  LOADING_REPORTS_GENERATION_MSG:
    "team_dashboard_dark_web_insights_generating_msg",
};
const loadingBreachCardStyles: ThemeUIStyleObject = {
  minHeight: "575px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  flexDirection: "column",
};
export const ScanningIncidentsLoader = () => {
  const { translate } = useTranslate();
  return (
    <Card sx={loadingBreachCardStyles}>
      <IndeterminateLoader size={88} />
      <br />
      <Paragraph color={colors.grey00}>
        {translate(I18N_KEYS.SCANNING_INCIDENTS_TXT)}
      </Paragraph>
    </Card>
  );
};
export const NoReportGeneratedMessage = () => {
  const { translate } = useTranslate();
  return (
    <Card sx={loadingBreachCardStyles}>
      <IndeterminateLoader size={88} />
      <br />
      <Paragraph color={colors.grey00}>
        {translate(I18N_KEYS.LOADING_REPORTS_GENERATION_MSG)}
      </Paragraph>
    </Card>
  );
};
