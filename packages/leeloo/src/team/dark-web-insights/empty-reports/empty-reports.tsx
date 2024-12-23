import { Card } from "@dashlane/design-system";
import { colors, Paragraph } from "@dashlane/ui-components";
import useTranslate from "../../../libs/i18n/useTranslate";
import noBreachesImg from "./assets/incidentFree.svg";
const I18N_KEYS = {
  INCIDENT_FREE_TITLE:
    "team_dashboard_dark_web_insights_domain_incident_free_title",
  INCIDENT_FREE_DESCRIPTION: "team_dwi_domain_incident_free_description",
};
interface EmptyReportsCardProps {
  domainName: string;
}
export const EmptyReports = ({ domainName }: EmptyReportsCardProps) => {
  const { translate } = useTranslate();
  return (
    <Card
      sx={{
        minHeight: "575px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
      }}
    >
      <img src={noBreachesImg} />
      <br />
      <Paragraph color={colors.black} bold={true} size="large">
        {translate(I18N_KEYS.INCIDENT_FREE_TITLE, {
          domainName,
        })}
      </Paragraph>
      <br />
      <Paragraph color={colors.grey00}>
        {translate(I18N_KEYS.INCIDENT_FREE_DESCRIPTION)}
      </Paragraph>
    </Card>
  );
};
