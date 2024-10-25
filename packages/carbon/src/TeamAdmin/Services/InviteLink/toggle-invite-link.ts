import {
  InviteLinkResponseErrorCode,
  InviteLinkResponseFailure,
  ToggleInviteLinkRequest,
  ToggleInviteLinkResult,
} from "@dashlane/communication";
import { CoreServices } from "Services";
import {
  getCode,
  getInviteLinkErrors,
  isApiError,
  toggleInviteLink as toggleInviteLinkApi,
} from "Libs/DashlaneApi";
import { requireAdmin } from "../EncryptionService/requireAdmin";
import { userLoginSelector } from "Session/selectors";
export async function toggleInviteLink(
  services: CoreServices,
  toggleInviteLInkRequest: ToggleInviteLinkRequest
): Promise<ToggleInviteLinkResult> {
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
    const toggleInviteLinkResponse = await toggleInviteLinkApi(
      storeService,
      login,
      toggleInviteLInkRequest
    );
    if (isApiError(toggleInviteLinkResponse)) {
      return {
        success: false,
        error: {
          code: getCode(toggleInviteLinkResponse.code, getInviteLinkErrors),
        },
      };
    }
    return {
      success: true,
      data: toggleInviteLinkResponse,
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
