import { LeaveFamilyResult } from "@dashlane/communication";
import { Debugger } from "Logs/Debugger";
import { CoreServices } from "Services";
import {
  getCode,
  isApiError,
  leaveFamily,
  UnknownError,
} from "Libs/DashlaneApi";
import { userLoginSelector } from "Session/selectors";
import { leaveFamilyErrors } from "Libs/DashlaneApi/services/familyplan/common-types";
export async function leaveFamilyRequest(
  services: CoreServices
): Promise<LeaveFamilyResult> {
  const { storeService, eventBusService } = services;
  const login = userLoginSelector(storeService.getState());
  try {
    const result = await leaveFamily(storeService, login);
    if (isApiError(result)) {
      return {
        success: false,
        error: {
          code: getCode(result.code, leaveFamilyErrors),
        },
      };
    }
    eventBusService.familyMemberLeft();
    return {
      success: true,
      response: {},
    };
  } catch (error) {
    Debugger.error(`[Family] leaveFamilyRequest - Failed: ${error}`);
    return {
      success: false,
      error: {
        code: UnknownError,
      },
    };
  }
}
