import {
  InviteLinkResponseErrorCode,
  RequestInviteLinkTokenRequest,
  RequestInviteLinkTokenResult,
} from "@dashlane/communication";
import { CoreServices } from "Services";
import {
  getCode,
  getInviteLinkErrors,
  isApiError,
  requestInviteLinkToken as requestInviteLinkTokenApi,
} from "Libs/DashlaneApi";
export async function requestInviteLinkToken(
  services: CoreServices,
  requestInviteLinkTokenRequest: RequestInviteLinkTokenRequest
): Promise<RequestInviteLinkTokenResult> {
  const { storeService } = services;
  try {
    const requestInviteLinkTokenResponse = await requestInviteLinkTokenApi(
      storeService,
      requestInviteLinkTokenRequest
    );
    if (isApiError(requestInviteLinkTokenResponse)) {
      return {
        success: false,
        error: {
          code: getCode(
            requestInviteLinkTokenResponse.code,
            getInviteLinkErrors
          ),
        },
      };
    }
    return {
      success: true,
      data: requestInviteLinkTokenResponse,
    };
  } catch (e) {
    return {
      success: false,
      error: {
        code: InviteLinkResponseErrorCode.UserInviteLinkNotFound,
      },
    };
  }
}
