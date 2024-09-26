import { TeamSettings } from ".";
export type UpdateTeamSettingsRequest = TeamSettings;
interface UpdateTeamSettingsSuccess {
  success: true;
}
interface UpdateTeamSettingsFailure {
  success: false;
  error: string;
}
export type UpdateTeamSettingsResult =
  | UpdateTeamSettingsSuccess
  | UpdateTeamSettingsFailure;
