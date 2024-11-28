import { useDiscontinuedStatus } from "../../../../libs/api";
export const useShowB2BDiscontinuationBanner = () => {
  const discontinuedStatus = useDiscontinuedStatus();
  if (discontinuedStatus.isLoading) {
    return null;
  }
  return (
    !!discontinuedStatus.isTeamSoftDiscontinued && !!discontinuedStatus.isTrial
  );
};
