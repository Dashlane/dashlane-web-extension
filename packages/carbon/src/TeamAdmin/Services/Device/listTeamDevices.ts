import {
  getCode,
  isApiError,
  listTeamDevices as listTeamDevicesApi,
  listTeamDevicesErrors,
} from "Libs/DashlaneApi";
import { userLoginSelector } from "Session/selectors";
import { CoreServices } from "Services";
import { ListTeamDevicesResult } from "TeamAdmin/Services/Device/types";
export async function listTeamDevices(
  services: CoreServices
): Promise<ListTeamDevicesResult> {
  const { storeService } = services;
  const state = storeService.getState();
  const login = userLoginSelector(state);
  if (!login) {
    throw new Error(`[listTeamDevices] - Session not opened!`);
  }
  const result = await listTeamDevicesApi(storeService, login);
  if (isApiError(result)) {
    return {
      success: false,
      error: {
        code: getCode(result.code, listTeamDevicesErrors),
      },
    };
  }
  return {
    success: true,
    data: {
      teamDevices: result.teamDevices,
    },
  };
}
