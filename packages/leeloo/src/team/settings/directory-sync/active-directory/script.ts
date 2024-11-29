export default function generateActiveDirectoryScript(
  activeDirectoryToken: string,
  teamId: number
): string {
  return `__REDACTED__${activeDirectoryToken}"
$TEAM_ID = "${teamId}__REDACTED__`;
}
