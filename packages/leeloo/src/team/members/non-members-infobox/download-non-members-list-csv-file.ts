import { fromUnixTime } from "date-fns";
import { NonMembersList } from "@dashlane/team-admin-contracts";
import { downloadFile } from "../../../libs/file-download/file-download";
export function downloadNonMembersCSVFile(nonMembersList: NonMembersList) {
  const header = [
    "user_id",
    "login",
    "premium_status",
    "proposedState",
    "last_activity_date",
  ];
  const body = nonMembersList
    .map((u) =>
      [
        u.userId,
        u.login,
        u.premiumStatus,
        u.proposedState,
        fromUnixTime(u.lastActivityDateUnix).toISOString(),
      ].join(",")
    )
    .join("\n");
  downloadFile(
    `${header.join(",")}\n${body}`,
    "non-members-list.csv",
    "text/csv;charset=utf-8"
  );
}
