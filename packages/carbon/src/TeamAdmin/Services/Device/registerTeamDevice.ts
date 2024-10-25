import {
  getCode,
  isApiError,
  registerTeamDevice as registerTeamDeviceApi,
  registerTeamDeviceErrors,
} from "Libs/DashlaneApi";
import { userLoginSelector } from "Session/selectors";
import { CoreServices } from "Services";
import {
  RegisterTeamDeviceRequest,
  RegisterTeamDeviceResult,
} from "TeamAdmin/Services/Device/types";
export async function registerTeamDevice(
  services: CoreServices,
  params: RegisterTeamDeviceRequest
): Promise<RegisterTeamDeviceResult> {
  const { storeService } = services;
  const { deviceName, platform } = params;
  const state = storeService.getState();
  const login = userLoginSelector(state);
  if (!login) {
    throw new Error(`
            [registerTeamDeviceRequest] - Session not opened!
        `);
  }
  const result = await registerTeamDeviceApi(storeService, login, {
    platform,
    deviceName,
  });
  if (isApiError(result)) {
    return {
      success: false,
      error: {
        code: getCode(result.code, registerTeamDeviceErrors),
      },
    };
  }
  return {
    success: true,
    data: {
      teamUuid: result.teamUuid,
      deviceAccessKey: result.deviceAccessKey,
      deviceSecretKey: result.deviceSecretKey,
    },
  };
}
