import { ComponentProps, ReactNode } from "react";
import { SecurityScoreRatingVSIndustry } from "@dashlane/team-admin-contracts";
import { DataStatus } from "@dashlane/framework-react";
import { Infobox, LinkButton } from "@dashlane/design-system";
import useTranslate from "../../../../libs/i18n/useTranslate";
import { useIsPersonalSpaceDisabled } from "../../../../libs/hooks/use-is-personal-space-disabled";
import { DISPLAY_HEALTH_SCORE_MIN_PASSWORDS } from "../../../constants";
interface Props {
  showDataWarning: boolean;
  ratingVSIndustry: SecurityScoreRatingVSIndustry | undefined;
  deltaVSIndustry: number | undefined;
}
export const I18N_KEYS = {
  GRAPH_NOT_ENOUGH_DATA_WARNING: "team_dashboard_graph_not_enough_data_warning",
  GRAPH_HEALTH_WARNING_WITHOUT_SPACES:
    "team_dashboard_graph_not_enough_data_warning_min",
  SCORE_HIGHER_THAN_BENCHMARK: "team_dashboard_industry_benchmark_info_higher",
  SCORE_LOWER_THAN_BENCHMARK: "team_dashboard_industry_benchmark_info_lower",
  SCORE_ON_PAR_WITH_BENCHARK: "team_dashboard_industry_benchmark_info_onpar",
  SCORE_BENCHMARK_CTA: "team_dashboard_industry_benchmark_cta",
};
const STYLES = {
  BANNER_MARGIN_TOP: "19px",
};
const PASSWORD_HEALTH_ARTICLE = "__REDACTED__";
export const PasswordHealthHistoryInfobox = ({
  showDataWarning,
  ratingVSIndustry,
  deltaVSIndustry,
}: Props) => {
  const { translate } = useTranslate();
  const isPersonalSpaceDisabled = useIsPersonalSpaceDisabled();
  const shouldMentionBusinessSpace =
    isPersonalSpaceDisabled.status === DataStatus.Success &&
    !isPersonalSpaceDisabled.isDisabled;
  const benchmarkFeedbackMap: Record<
    SecurityScoreRatingVSIndustry,
    {
      message: string;
      infoboxMood: ComponentProps<typeof Infobox>["mood"];
      ctas: ReactNode[];
    }
  > = {
    lower: {
      message: translate(I18N_KEYS.SCORE_LOWER_THAN_BENCHMARK, {
        count: deltaVSIndustry,
      }),
      infoboxMood: "danger",
      ctas: [
        <LinkButton
          key="see_how_danger"
          href={PASSWORD_HEALTH_ARTICLE}
          isExternal
        >
          {translate(I18N_KEYS.SCORE_BENCHMARK_CTA)}
        </LinkButton>,
      ],
    },
    onPar: {
      message: translate(I18N_KEYS.SCORE_ON_PAR_WITH_BENCHARK),
      infoboxMood: "warning",
      ctas: [
        <LinkButton
          key="see_how_warning"
          href={PASSWORD_HEALTH_ARTICLE}
          isExternal
        >
          {translate(I18N_KEYS.SCORE_BENCHMARK_CTA)}
        </LinkButton>,
      ],
    },
    higher: {
      message: translate(I18N_KEYS.SCORE_HIGHER_THAN_BENCHMARK, {
        count: deltaVSIndustry,
      }),
      infoboxMood: "positive",
      ctas: [],
    },
  };
  return showDataWarning ? (
    <Infobox
      size="medium"
      sx={{ marginTop: STYLES.BANNER_MARGIN_TOP }}
      title={translate(
        shouldMentionBusinessSpace
          ? I18N_KEYS.GRAPH_NOT_ENOUGH_DATA_WARNING
          : I18N_KEYS.GRAPH_HEALTH_WARNING_WITHOUT_SPACES,
        {
          minPasswords: DISPLAY_HEALTH_SCORE_MIN_PASSWORDS,
        }
      )}
    />
  ) : ratingVSIndustry ? (
    <Infobox
      size="large"
      sx={{ marginTop: STYLES.BANNER_MARGIN_TOP }}
      title={benchmarkFeedbackMap[ratingVSIndustry].message}
      mood={benchmarkFeedbackMap[ratingVSIndustry].infoboxMood}
      actions={benchmarkFeedbackMap[ratingVSIndustry].ctas}
      icon={
        ratingVSIndustry === "higher"
          ? "HealthPositiveOutlined"
          : "HealthNegativeOutlined"
      }
    />
  ) : null;
};
