import {
  MidCycleTierUpgradePrice,
  teamPlanUpdateApi,
} from "@dashlane/team-admin-contracts";
import { DataStatus, useModuleQuery } from "@dashlane/framework-react";
interface UseMidCycleTierUpgradePriceProps {
  newTotalNumberOfSeats: number;
  planName?: string;
  onError?: () => void;
}
interface UseMidCycleTierUpgradePriceOutput {
  isLoading: boolean;
  midCycleTierUpgradePrice?: MidCycleTierUpgradePrice;
  isMidCycleGracePeriod?: boolean;
}
export function useMidCycleTierUpgradePrice({
  newTotalNumberOfSeats,
  planName,
  onError,
}: UseMidCycleTierUpgradePriceProps): UseMidCycleTierUpgradePriceOutput {
  const midcycleTierUpgradePrice = useModuleQuery(
    teamPlanUpdateApi,
    "getMidcycleTierUpgradePrice",
    {
      newTotalNumberOfSeats,
      newPlan: planName ?? "",
    },
    { initialSkip: !newTotalNumberOfSeats || !planName }
  );
  switch (midcycleTierUpgradePrice.status) {
    case DataStatus.Loading: {
      return { isLoading: true };
    }
    case DataStatus.Error: {
      onError?.();
      const isMidCycleGracePeriod =
        midcycleTierUpgradePrice.error.tag === "NoMtuDuringGracePeriod";
      return { isLoading: false, isMidCycleGracePeriod: isMidCycleGracePeriod };
    }
    case DataStatus.Success: {
      return {
        isLoading: false,
        midCycleTierUpgradePrice: midcycleTierUpgradePrice.data,
      };
    }
  }
}
