import {
  RemoveFamilyMemberRequest,
  RemoveFamilyMemberResult,
} from "@dashlane/communication";
import { Debugger } from "Logs/Debugger";
import { CoreServices } from "Services";
import {
  getCode,
  isApiError,
  removeFamilyMember,
  UnknownError,
} from "Libs/DashlaneApi";
import { userLoginSelector } from "Session/selectors";
import { removeFamilyMemberErrors } from "Libs/DashlaneApi/services/familyplan/common-types";
export async function removeFamilyMemberRequest(
  services: CoreServices,
  params: RemoveFamilyMemberRequest
): Promise<RemoveFamilyMemberResult> {
  const { storeService } = services;
  const login = userLoginSelector(storeService.getState());
  try {
    const result = await removeFamilyMember(storeService, login, {
      userId: params.userId,
    });
    if (isApiError(result)) {
      return {
        success: false,
        error: {
          code: getCode(result.code, removeFamilyMemberErrors),
        },
      };
    }
    return {
      success: true,
      response: {},
    };
  } catch (error) {
    Debugger.error(`[Family] removeFamilyMemberRequest - Failed: ${error}`);
    return {
      success: false,
      error: {
        code: UnknownError,
      },
    };
  }
}
