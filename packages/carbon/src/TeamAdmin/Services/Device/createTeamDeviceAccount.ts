import {
  CreateTeamDeviceAccountRequest,
  CreateTeamDeviceAccountResult,
} from "@dashlane/communication";
import {
  createTeamDeviceAccount as createTeamDeviceAccountApi,
  createTeamDeviceAccountErrors,
  getCode,
  isApiError,
} from "Libs/DashlaneApi";
import { userLoginSelector } from "Session/selectors";
import { CoreServices } from "Services";
export const createTeamDeviceAccount = async (
  services: CoreServices,
  params: CreateTeamDeviceAccountRequest
): Promise<CreateTeamDeviceAccountResult> => {
  const { storeService } = services;
  const state = storeService.getState();
  const login = userLoginSelector(state);
  if (!login) {
    throw new Error(`
            [createTeamDeviceAccount] - Session not opened!
        `);
  }
  const response = await createTeamDeviceAccountApi(
    storeService,
    login,
    params
  );
  if (isApiError(response)) {
    return {
      success: false,
      error: {
        code: getCode(response.code, createTeamDeviceAccountErrors),
      },
    };
  } else {
    return {
      success: true,
      data: {
        login: response.login,
      },
    };
  }
};
