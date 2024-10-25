import {
  getCode,
  getTeamDevice as getTeamDeviceApi,
  getTeamDeviceErrors,
  isApiError,
} from "Libs/DashlaneApi";
import { userLoginSelector } from "Session/selectors";
import { CoreServices } from "Services";
import {
  GetTeamDeviceRequest,
  GetTeamDeviceResult,
} from "TeamAdmin/Services/Device/types";
export async function getTeamDevice(
  services: CoreServices,
  params: GetTeamDeviceRequest
): Promise<GetTeamDeviceResult> {
  const { storeService } = services;
  const { teamDeviceAccessKey } = params;
  const state = storeService.getState();
  const login = userLoginSelector(state);
  if (!login) {
    throw new Error(`[getTeamDevice] - Session not opened!`);
  }
  const result = await getTeamDeviceApi(storeService, login, {
    teamDeviceAccessKey,
  });
  if (isApiError(result)) {
    return {
      success: false,
      error: {
        code: getCode(result.code, getTeamDeviceErrors),
      },
    };
  }
  return {
    success: true,
    data: {
      teamDevice: result.teamDevice,
    },
  };
}
