import {
  FamilyMemberRoles,
  GetFamilyDetailsResult,
} from "@dashlane/communication";
import {
  getAdmin,
  getMembersByRole,
  getSpots,
} from "Family/services/getFamilyMembers";
import { Debugger } from "Logs/Debugger";
import { CoreServices } from "Services";
import {
  getCode,
  getFamilyDetails,
  isApiError,
  UnknownError,
} from "Libs/DashlaneApi";
import { userLoginSelector } from "Session/selectors";
import { UserMustBeFamilyAdmin } from "Libs/DashlaneApi/services/familyplan/common-types";
export async function getFamilyDetailsRequest(
  services: CoreServices
): Promise<GetFamilyDetailsResult> {
  const { storeService } = services;
  const login = userLoginSelector(storeService.getState());
  try {
    const result = await getFamilyDetails(storeService, login);
    if (isApiError(result)) {
      return {
        success: false,
        error: {
          code: getCode(result.code, [UserMustBeFamilyAdmin]),
        },
      };
    }
    const { name, id, joinToken, statusCode, members, maxMembers } = result;
    return {
      success: true,
      response: {
        name,
        id,
        joinToken,
        statusCode,
        members: {
          admin: getAdmin(members),
          regular: getMembersByRole(members, FamilyMemberRoles.REGULAR),
          removed: getMembersByRole(members, FamilyMemberRoles.REMOVED),
        },
        spots: getSpots(members, maxMembers),
      },
    };
  } catch (error) {
    Debugger.error(`[Family] getFamilyDetailsRequest - Failed: ${error}`);
    return {
      success: false,
      error: {
        code: UnknownError,
      },
    };
  }
}
