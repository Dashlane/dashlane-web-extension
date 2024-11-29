import { PasswordHealthHistory as ReportPasswordHealthHistory } from "@dashlane/team-admin-contracts";
import { DataStatus } from "@dashlane/framework-react";
import { Heading } from "@dashlane/design-system";
import useTranslate from "../../../../libs/i18n/useTranslate";
import { LineGraph } from "./line-graph/LineGraph";
import { useTeamCreationDate } from "../../../hooks/use-team-creation-date-unix";
import { useIndustryBenchmarkData } from "../../../hooks/use-industry-benchmark-data";
import { PasswordHealthHistoryInfobox } from "./PasswordHealthHistoryInfobox";
const I18N_KEYS = {
  GRAPH_ALL_TIME_BUTTON: "team_dashboard_graph_all_time_button",
  GRAPH_HEADING: "team_dashboard_graph_heading",
  GRAPH_SCORE_HOVER_LEGEND: "team_dashboard_graph_score_hover_legend",
  GRAPH_SCORE_LEGEND: "team_dashboard_graph_score_legend",
};
interface GraphProps {
  isLoading: boolean;
  history: ReportPasswordHealthHistory[];
  passwordHealthHistoryEmpty: boolean;
}
export const PasswordHealthHistory = ({
  isLoading,
  history,
  passwordHealthHistoryEmpty,
}: GraphProps) => {
  const { translate } = useTranslate();
  const teamCreationDate = useTeamCreationDate();
  const industryBenchmark = useIndustryBenchmarkData();
  if (
    teamCreationDate.status !== DataStatus.Success ||
    industryBenchmark.status !== DataStatus.Success
  ) {
    return null;
  }
  const showNotEnoughDataWarning = !isLoading && passwordHealthHistoryEmpty;
  const { ratingVSIndustry, deltaVSIndustry } = { ...industryBenchmark.data };
  const showHealthBenchmarkData = !!ratingVSIndustry;
  const showInfobox = showNotEnoughDataWarning || showHealthBenchmarkData;
  return (
    <section
      sx={{
        padding: "24px",
        paddingBottom: "0",
        flexGrow: 1,
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Heading
        as="h5"
        color="ds.text.neutral.catchy"
        textStyle="ds.title.section.medium"
      >
        {translate(I18N_KEYS.GRAPH_HEADING)}
      </Heading>
      {showInfobox ? (
        <PasswordHealthHistoryInfobox
          showDataWarning={showNotEnoughDataWarning}
          ratingVSIndustry={ratingVSIndustry}
          deltaVSIndustry={deltaVSIndustry}
        />
      ) : null}
      <LineGraph
        history={history}
        infoboxOnTop={showInfobox}
        passwordHealthHistoryEmpty={passwordHealthHistoryEmpty}
      />
    </section>
  );
};
