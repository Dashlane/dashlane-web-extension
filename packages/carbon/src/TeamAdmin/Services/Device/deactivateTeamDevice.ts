import {
  deactivateTeamDevice as deactivateTeamDeviceApi,
  deactivateTeamDeviceErrors,
  getCode,
  isApiError,
} from "Libs/DashlaneApi";
import { userLoginSelector } from "Session/selectors";
import { CoreServices } from "Services";
import {
  DeactivateTeamDeviceRequest,
  DeactivateTeamDeviceResult,
} from "TeamAdmin/Services/Device/types";
export async function deactivateTeamDevice(
  services: CoreServices,
  { teamDeviceAccessKey }: DeactivateTeamDeviceRequest
): Promise<DeactivateTeamDeviceResult> {
  const { storeService } = services;
  const state = storeService.getState();
  const login = userLoginSelector(state);
  if (!login) {
    throw new Error(`
            [registerTeamDeviceRequest] - Session not opened!
        `);
  }
  const result = await deactivateTeamDeviceApi(storeService, login, {
    teamDeviceAccessKey,
  });
  if (isApiError(result)) {
    return {
      success: false,
      error: {
        code: getCode(result.code, deactivateTeamDeviceErrors),
      },
    };
  }
  return {
    success: true,
    data: {},
  };
}
