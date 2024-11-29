import * as React from "react";
import { PageView } from "@dashlane/hermes";
import { logPageView } from "../../../libs/logs/logEvent";
import { useTeamCapabilities } from "../../settings/hooks/use-team-capabilities";
import { AuditLogsWithFilters } from "./audit-logs-with-filters";
import { StarterActivityPaywall } from "../paywall/starter-activity-paywall";
const RecentActivity = () => {
  const teamCapabilities = useTeamCapabilities();
  const displayActivityLogPaywall = !teamCapabilities?.activityLog.enabled;
  React.useEffect(() => {
    logPageView(PageView.TacActivityList);
  }, []);
  return (
    <div>
      {displayActivityLogPaywall ? (
        <StarterActivityPaywall />
      ) : (
        <AuditLogsWithFilters />
      )}
    </div>
  );
};
export default RecentActivity;
