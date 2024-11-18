import {
  GetInviteLinkForAdminResult,
  InviteLinkResponseErrorCode,
  InviteLinkResponseFailure,
} from "@dashlane/communication";
import { CoreServices } from "Services";
import {
  getCode,
  getInviteLinkErrors,
  getInviteLinkForAdmin as getInviteLinkForAdminApi,
  isApiError,
} from "Libs/DashlaneApi";
import { requireAdmin } from "../EncryptionService/requireAdmin";
import { userLoginSelector } from "Session/selectors";
export async function getInviteLinkForAdmin(
  services: CoreServices
): Promise<GetInviteLinkForAdminResult> {
  const { storeService } = services;
  try {
    const login = userLoginSelector(storeService.getState());
    const NotAdminResponse: InviteLinkResponseFailure = {
      success: false,
      error: {
        code: InviteLinkResponseErrorCode.NotAdmin,
      },
    };
    try {
      requireAdmin(storeService);
    } catch {
      return NotAdminResponse;
    }
    if (!login) {
      return NotAdminResponse;
    }
    const getInviteLinkForAdminResponse = await getInviteLinkForAdminApi(
      storeService,
      login
    );
    if (isApiError(getInviteLinkForAdminResponse)) {
      return {
        success: false,
        error: {
          code: getCode(
            getInviteLinkForAdminResponse.code,
            getInviteLinkErrors
          ),
        },
      };
    }
    return {
      success: true,
      data: getInviteLinkForAdminResponse,
    };
  } catch (e) {
    return {
      success: false,
      error: {
        code: InviteLinkResponseErrorCode.InviteLinkNotFound,
      },
    };
  }
}
