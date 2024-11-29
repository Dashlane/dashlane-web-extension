import { IndeterminateLoader } from "@dashlane/design-system";
import { EmailIncidentInfo } from "@dashlane/communication";
import { TableAccordionRow } from "./table-accordion-row/table-accordion-row";
import useTranslate from "../../../libs/i18n/useTranslate";
import { TableHeader } from "../../page/table-header";
const I18N_KEYS = {
  TABLE_HEADER_EMAIL_AFFECTED:
    "team_dark_web_insights_table_header_email_affected",
  TABLE_HEADER_INCIDENTS: "team_dark_web_insights_table_header_incidents",
  TABLE_HEADER_DATA_AFFECTED:
    "team_dark_web_insights_table_header_data_affected",
  TABLE_HEADER_LAST_INCIDENT:
    "team_dark_web_insights_table_header_last_incident",
  TABLE_HEADER_MEMBER_STATUS:
    "team_dark_web_insights_table_header_member_status",
};
interface ReportTableProps {
  emailsToInvite: string[];
  reports: EmailIncidentInfo[];
  isLoading: boolean;
  pendingMembers: string[];
  onInviteAction: (email: string) => void;
}
export const ReportTable = ({
  emailsToInvite,
  reports,
  isLoading,
  pendingMembers,
  onInviteAction,
}: ReportTableProps) => {
  const { translate } = useTranslate();
  const columns = [
    {
      headerLabel: translate(I18N_KEYS.TABLE_HEADER_EMAIL_AFFECTED),
      headerKey: "email-affected",
    },
    {
      headerLabel: translate(I18N_KEYS.TABLE_HEADER_INCIDENTS),
      headerKey: "incidents",
    },
    {
      headerLabel: translate(I18N_KEYS.TABLE_HEADER_DATA_AFFECTED),
      headerKey: "data-affected",
    },
    {
      headerLabel: translate(I18N_KEYS.TABLE_HEADER_LAST_INCIDENT),
      headerKey: "last-incident",
    },
    {
      headerLabel: translate(I18N_KEYS.TABLE_HEADER_MEMBER_STATUS),
      headerKey: "member-status",
    },
    { headerLabel: "", headerKey: "actions" },
  ];
  return (
    <div
      sx={{
        minWidth: "100%",
        minHeight: "600px",
      }}
    >
      {isLoading ? (
        <div
          sx={{
            display: "block",
            width: "950px",
            height: "600px",
            position: "absolute",
            textAlign: "center",
          }}
        >
          <IndeterminateLoader
            sx={{
              position: "relative",
              top: "50%",
            }}
            size={120}
          />
        </div>
      ) : null}
      <table
        sx={{
          minWidth: "100%",
        }}
      >
        <TableHeader columns={columns} />
        <tbody sx={isLoading ? { opacity: "0.5" } : {}}>
          {reports.map((userReport) => (
            <TableAccordionRow
              key={userReport.email}
              userReport={userReport}
              onInviteAction={onInviteAction}
              isPendingMember={pendingMembers.includes(userReport.email)}
              shouldShowInviteButton={emailsToInvite.includes(userReport.email)}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};
