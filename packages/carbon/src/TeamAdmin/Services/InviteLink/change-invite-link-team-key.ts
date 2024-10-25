import {
  ChangeInviteLinkTeamKeyResult,
  InviteLinkResponseErrorCode,
  InviteLinkResponseFailure,
} from "@dashlane/communication";
import { CoreServices } from "Services";
import {
  changeInviteLinkTeamKey as changeInviteLinkTeamKeyApi,
  getCode,
  getInviteLinkErrors,
  isApiError,
} from "Libs/DashlaneApi";
import { requireAdmin } from "../EncryptionService/requireAdmin";
import { userLoginSelector } from "Session/selectors";
export async function changeInviteLinkTeamKey(
  services: CoreServices
): Promise<ChangeInviteLinkTeamKeyResult> {
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
    const changeInviteLinkTeamKeyResponse = await changeInviteLinkTeamKeyApi(
      storeService,
      login
    );
    if (isApiError(changeInviteLinkTeamKeyResponse)) {
      return {
        success: false,
        error: {
          code: getCode(
            changeInviteLinkTeamKeyResponse.code,
            getInviteLinkErrors
          ),
        },
      };
    }
    return {
      success: true,
      data: changeInviteLinkTeamKeyResponse,
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
