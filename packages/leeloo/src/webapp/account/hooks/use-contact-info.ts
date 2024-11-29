import { useEffect } from "react";
import { DataStatus, useCarbonEndpoint } from "@dashlane/carbon-api-consumers";
import { ContactInfo } from "@dashlane/communication";
import { carbonConnector } from "../../../libs/carbon/connector";
export function useAccountContactInfo(): ContactInfo | undefined {
  const refresh = async () => {
    await carbonConnector.refreshContactInfo(undefined);
  };
  useEffect(() => {
    void refresh();
  }, []);
  const contactInfo = useCarbonEndpoint(
    {
      queryConfig: {
        query: carbonConnector.getContactInfo,
      },
      liveConfig: {
        live: carbonConnector.liveContactInfo,
      },
    },
    []
  );
  return contactInfo.status === DataStatus.Success
    ? contactInfo.data
    : undefined;
}
