import {
  DataStatus,
  useFeatureFlip,
  useModuleQuery,
} from "@dashlane/framework-react";
import {
  IndustryBenchmarkData,
  TEAM_PLAN_DETAILS_FEATURE_FLIPS,
  teamPlanDetailsApi,
} from "@dashlane/team-admin-contracts";
type UseGetIndustryBenchmarkDataOutput =
  | {
      status: DataStatus.Loading | DataStatus.Error;
    }
  | {
      status: DataStatus.Success;
      data: IndustryBenchmarkData;
    };
export const useIndustryBenchmarkData =
  (): UseGetIndustryBenchmarkDataOutput => {
    const hasIndustryBenchmarkFF = useFeatureFlip(
      TEAM_PLAN_DETAILS_FEATURE_FLIPS.DashHackIndustryBenchmarkDev
    );
    const { data, status } = useModuleQuery(
      teamPlanDetailsApi,
      "getIndustryBenchmarkData"
    );
    if (status !== DataStatus.Success) {
      return { status };
    }
    return {
      status,
      data: hasIndustryBenchmarkFF ? data : null,
    };
  };
