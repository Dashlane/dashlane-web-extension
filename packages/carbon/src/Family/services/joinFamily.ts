import { JoinFamilyRequest, JoinFamilyResult } from "@dashlane/communication";
import { Debugger } from "Logs/Debugger";
import { CoreServices } from "Services";
import {
  getCode,
  isApiError,
  joinFamily,
  UnknownError,
} from "Libs/DashlaneApi";
import { getUserStatus } from "Family/services/getUserStatus";
import { getRenewalInformation } from "Family/services/getRenewalInformation";
import { joinFamilyErrors } from "Libs/DashlaneApi/services/familyplan/common-types";
export async function joinFamilyRequest(
  services: CoreServices,
  params: JoinFamilyRequest
): Promise<JoinFamilyResult> {
  const { storeService } = services;
  const { login, joinToken } = params;
  try {
    const result = await joinFamily(storeService, {
      login,
      joinToken,
    });
    if (isApiError(result)) {
      return {
        success: false,
        error: {
          code: getCode(result.code, joinFamilyErrors),
        },
      };
    }
    const { name, userExists, statusCode, stopRenewalResult } = result;
    const renewalInformation = getRenewalInformation(stopRenewalResult);
    return {
      success: true,
      response: {
        name,
        userExists,
        userStatus: getUserStatus(statusCode, userExists),
        renewalInformation,
      },
    };
  } catch (error) {
    Debugger.error(`[Family] joinFamilyRequest - Failed: ${error}`);
    return {
      success: false,
      error: {
        code: UnknownError,
      },
    };
  }
}
