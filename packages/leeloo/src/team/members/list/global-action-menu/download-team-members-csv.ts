import { TeamMemberInfo } from "@dashlane/communication";
import { fromUnixTime } from "date-fns";
import { downloadFile } from "../../../../libs/file-download/file-download";
import { DISPLAY_HEALTH_SCORE_MIN_PASSWORDS } from "../../../constants";
const buildNaiveCSV = (members: TeamMemberInfo[]): string => {
  const header = [
    "login email",
    "status",
    "twoFA_Status",
    "number_passwords",
    "weak_passwords",
    "reused_passwords",
    "compromised_passwords",
    "password_health_score",
    "sso_status",
    "account_recovery_key_status",
    "admin_recovery_status",
    "last_active",
  ];
  const body = members
    .map((m) =>
      [
        m.login,
        m.status,
        m.twoFAInformation?.type,
        m.nbrPasswords ?? 0,
        m.weakPasswords ?? 0,
        m.reused ?? 0,
        m.compromisedPasswords ?? 0,
        m.nbrPasswords >= DISPLAY_HEALTH_SCORE_MIN_PASSWORDS
          ? m.securityIndex
          : "unavailable",
        m.ssoStatus,
        m.accountRecoveryKeyStatus,
        m.recoveryCreationDateUnix ? "enabled" : "disabled",
        m.lastUpdateDateUnix
          ? fromUnixTime(m.lastUpdateDateUnix).toISOString()
          : m.revokedDateUnix
          ? fromUnixTime(m.revokedDateUnix).toISOString()
          : m.status,
      ].join(",")
    )
    .join("\n");
  return `${header.join(",")}\n${body}`;
};
export const downloadTeamMembersCSV = (members: TeamMemberInfo[]) => {
  downloadFile(
    buildNaiveCSV(members),
    "team-members.csv",
    "text/csv;charset=utf-8"
  );
};
