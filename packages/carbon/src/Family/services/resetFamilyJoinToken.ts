import { ResetFamilyJoinTokenResult } from "@dashlane/communication";
import { Debugger } from "Logs/Debugger";
import { CoreServices } from "Services";
import {
  getCode,
  isApiError,
  resetFamilyJoinToken,
  UnknownError,
} from "Libs/DashlaneApi";
import { userLoginSelector } from "Session/selectors";
import { UserMustBeFamilyAdmin } from "Libs/DashlaneApi/services/familyplan/common-types";
export async function resetFamilyJoinTokenRequest(
  services: CoreServices
): Promise<ResetFamilyJoinTokenResult> {
  const { storeService } = services;
  const login = userLoginSelector(storeService.getState());
  try {
    const result = await resetFamilyJoinToken(storeService, login);
    if (isApiError(result)) {
      return {
        success: false,
        error: {
          code: getCode(result.code, [UserMustBeFamilyAdmin]),
        },
      };
    }
    const { joinToken } = result;
    return {
      success: true,
      response: {
        joinToken,
      },
    };
  } catch (error) {
    Debugger.error(`[Family] resetFamilyJoinTokenRequest - Failed: ${error}`);
    return {
      success: false,
      error: {
        code: UnknownError,
      },
    };
  }
}
