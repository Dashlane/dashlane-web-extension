import { type TeamSettings } from "@dashlane/communication";
import { _makeRequest } from "Libs/WS/request";
import { WSRequestTeamParams, WSResponse } from "Libs/WS/types";
const WSVERSION = 1;
const WSNAME = "teamPlans";
export interface WSSettings {
  getTeamSettings: (
    params: WSRequestTeamParams
  ) => Promise<WSResponse<WSTeamSettingsResponseContent>>;
  setTeamSettings: (
    params: WSRequestTeamSettingsParams
  ) => Promise<WSResponse<any>>;
}
export const makeWSSettings = (): WSSettings => {
  return {
    getTeamSettings: (params) => getTeamSettings(params),
    setTeamSettings: (params) => setTeamSettings(params),
  };
};
export type WSTeamSettingsResponseContent = {
  team: {
    info: TeamSettings;
  };
};
export function getTeamSettings(
  params: WSRequestTeamParams
): Promise<WSResponse<WSTeamSettingsResponseContent>> {
  return _makeRequest<
    WSResponse<WSTeamSettingsResponseContent>,
    WSRequestTeamParams
  >(WSNAME, WSVERSION, "status", params);
}
export type WSSettingOperation = {
  type: string;
  value: any;
};
export interface WSRequestTeamSettingsParams extends WSRequestTeamParams {
  operations: WSSettingOperation[];
}
export function setTeamSettings(
  params: WSRequestTeamSettingsParams
): Promise<WSResponse<any>> {
  return _makeRequest<WSResponse<any>, WSRequestTeamSettingsParams>(
    WSNAME,
    WSVERSION,
    "editSettings",
    params
  );
}
