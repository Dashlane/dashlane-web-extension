import {
  GetInviteLinkRequest,
  GetInviteLinkResult,
  InviteLinkResponseErrorCode,
} from "@dashlane/communication";
import { CoreServices } from "Services";
import {
  getCode,
  getInviteLink as getInviteLinkApi,
  getInviteLinkErrors,
  isApiError,
} from "Libs/DashlaneApi";
export async function getInviteLink(
  services: CoreServices,
  getInviteLinkRequest: GetInviteLinkRequest
): Promise<GetInviteLinkResult> {
  const { storeService } = services;
  try {
    const getInviteLinkResponse = await getInviteLinkApi(
      storeService,
      getInviteLinkRequest
    );
    if (isApiError(getInviteLinkResponse)) {
      return {
        success: false,
        error: {
          code: getCode(getInviteLinkResponse.code, getInviteLinkErrors),
        },
      };
    }
    return {
      success: true,
      data: getInviteLinkResponse,
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
