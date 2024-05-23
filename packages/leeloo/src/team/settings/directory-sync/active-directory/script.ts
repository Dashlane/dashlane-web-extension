export default function generateActiveDirectoryScript(activeDirectoryToken: string, teamId: number): string {
    return `*****${activeDirectoryToken}"
$TEAM_ID = "${teamId}*****`;
}
