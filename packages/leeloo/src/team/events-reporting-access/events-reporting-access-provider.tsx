import { createContext } from "react";
import { useFeatureFlip } from "@dashlane/framework-react";
export const EventsReportingAccessContext = createContext<boolean>(false);
export const EventsReportingAccessProvider = ({
  children,
}: React.PropsWithChildren<Record<never, never>>) => {
  const hasSiemIntegrationAccess = useFeatureFlip(
    "setup_rollout_splunk_integration_prod"
  );
  return (
    <EventsReportingAccessContext.Provider value={!!hasSiemIntegrationAccess}>
      {children}
    </EventsReportingAccessContext.Provider>
  );
};
