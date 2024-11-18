import {
  GetLastADSyncDateResult,
  GetLastADSyncDateResultFailure,
} from "@dashlane/communication";
import {
  getCode,
  isApiError,
  lastADSyncDate,
  lastADSyncDateErrors,
  NotAdmin,
} from "Libs/DashlaneApi";
import { userLoginSelector } from "Session/selectors";
import { CoreServices } from "Services";
import { requireAdmin } from "../EncryptionService/requireAdmin";
export async function getLastADSyncDate(
  services: CoreServices
): Promise<GetLastADSyncDateResult> {
  const { storeService } = services;
  const login = userLoginSelector(storeService.getState());
  const NotAdminResponse: GetLastADSyncDateResultFailure = {
    success: false,
    error: {
      code: NotAdmin,
    },
  };
  if (!login) {
    return NotAdminResponse;
  }
  try {
    requireAdmin(storeService);
  } catch {
    return NotAdminResponse;
  }
  const result = await lastADSyncDate(storeService, login);
  if (isApiError(result)) {
    return {
      success: false,
      error: {
        code: getCode(result.code, lastADSyncDateErrors),
      },
    };
  }
  return {
    success: true,
    data: { ...result },
  };
}
