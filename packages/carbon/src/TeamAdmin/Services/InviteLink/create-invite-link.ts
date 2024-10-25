import {
  CreateInviteLinkRequest,
  CreateInviteLinkResult,
  InviteLinkResponseErrorCode,
  InviteLinkResponseFailure,
} from "@dashlane/communication";
import { CoreServices } from "Services";
import {
  createInviteLink as createInviteLinkApi,
  getCode,
  getInviteLinkErrors,
  isApiError,
} from "Libs/DashlaneApi";
import { requireAdmin } from "../EncryptionService/requireAdmin";
import { userLoginSelector } from "Session/selectors";
export async function createInviteLink(
  services: CoreServices,
  createInviteLinkRequest: CreateInviteLinkRequest
): Promise<CreateInviteLinkResult> {
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
    const createInviteLinkResponse = await createInviteLinkApi(
      storeService,
      login,
      createInviteLinkRequest
    );
    if (isApiError(createInviteLinkResponse)) {
      return {
        success: false,
        error: {
          code: getCode(createInviteLinkResponse.code, getInviteLinkErrors),
        },
      };
    }
    return {
      success: true,
      data: createInviteLinkResponse,
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
