import { DataStatus } from "@dashlane/carbon-api-consumers";
import { useCapabilities } from "../../../../libs/carbon/hooks/useCapabilities";
type UseHasSharingRestrictedToTeam =
  | {
      status: DataStatus.Loading | DataStatus.Error;
    }
  | {
      status: DataStatus.Success;
      hasSharingRestrictedToTeam: boolean;
    };
const SHARING_RESTRICTION_POLICY_NAME = "internalSharingOnly";
export const useHasSharingRestrictedToTeam =
  (): UseHasSharingRestrictedToTeam => {
    const capabilities = useCapabilities([SHARING_RESTRICTION_POLICY_NAME]);
    if (capabilities.status !== DataStatus.Success) {
      return {
        status: capabilities.status,
      };
    }
    return {
      status: DataStatus.Success,
      hasSharingRestrictedToTeam: capabilities.data,
    };
  };
