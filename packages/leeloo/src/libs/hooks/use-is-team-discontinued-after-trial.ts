import { useDiscontinuedStatus } from "../carbon/hooks/useNodePremiumStatus";
export const useIsTeamDiscontinuedAfterTrial = (): boolean | null => {
  const discontinuedStatus = useDiscontinuedStatus();
  if (discontinuedStatus.isLoading) {
    return null;
  }
  return (
    !!discontinuedStatus.isTeamSoftDiscontinued && !!discontinuedStatus.isTrial
  );
};
