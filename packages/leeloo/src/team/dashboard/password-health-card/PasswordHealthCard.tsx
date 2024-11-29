import { GetReportQueryResult } from "@dashlane/team-admin-contracts";
import { Card } from "@dashlane/design-system";
import { PasswordHealthHistory } from "./password-health-history/PasswordHealthHistory";
import { PasswordHealthDetailsRow } from "./password-health-details-row/PasswordHealthDetailsRow";
interface PasswordHealthCardProps {
  isLoading: boolean;
  report: GetReportQueryResult;
  passwordHealthHistoryEmpty: boolean;
}
export const PasswordHealthCard = ({
  isLoading,
  report,
  passwordHealthHistoryEmpty,
}: PasswordHealthCardProps) => {
  return (
    <Card
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        backgroundColor: "ds.container.agnostic.neutral.supershy",
        borderColor: "ds.border.neutral.quiet.idle",
        padding: 0,
      }}
    >
      <PasswordHealthHistory
        isLoading={isLoading}
        history={report.passwordHealthHistory}
        passwordHealthHistoryEmpty={passwordHealthHistoryEmpty}
      />
      <PasswordHealthDetailsRow
        {...report.passwordHealth}
        passwordHealthHistoryEmpty={passwordHealthHistoryEmpty}
      />
    </Card>
  );
};
