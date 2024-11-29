import { SpaceTier } from "@dashlane/team-admin-contracts";
import { useTeamBillingInformation } from "../../libs/hooks/use-team-billing-information";
export const useIsBusinessPlus = () => {
  const teamBillingInformation = useTeamBillingInformation();
  return teamBillingInformation?.spaceTier === SpaceTier.BusinessPlus;
};
