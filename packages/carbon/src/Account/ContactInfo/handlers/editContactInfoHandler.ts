import {
  EditContactInfoClientRequest,
  EditContactInfoClientResult,
  EditContactInfoErrorCode,
} from "@dashlane/communication";
import { CoreServices } from "Services";
import {
  isApiError,
  updateContactInfo,
  UpdateContactInfoError,
} from "Libs/DashlaneApi";
import { userLoginSelector } from "Session/selectors";
const mapServerCodeToError: Record<
  UpdateContactInfoError,
  EditContactInfoErrorCode
> = {
  contact_email_required: EditContactInfoErrorCode.EMPTY_EMAIL,
  contact_phone_required: EditContactInfoErrorCode.UNKNOWN_ERROR,
  invalid_contact_email: EditContactInfoErrorCode.INVALID_EMAIL,
};
export async function editContactInfoHandler(
  services: CoreServices,
  editContactInfoClientRequest: EditContactInfoClientRequest
): Promise<EditContactInfoClientResult> {
  const { storeService, sessionService } = services;
  const { user: userSessionService } = sessionService.getInstance();
  const state = storeService.getState();
  const login = userLoginSelector(state);
  if (!storeService.isAuthenticated()) {
    return {
      success: false,
      error: {
        code: EditContactInfoErrorCode.UNKNOWN_ERROR,
      },
    };
  }
  try {
    const result = await updateContactInfo(
      storeService,
      login,
      editContactInfoClientRequest
    );
    if (isApiError(result)) {
      return {
        success: false,
        error: {
          code:
            mapServerCodeToError[result.code] ??
            EditContactInfoErrorCode.UNKNOWN_ERROR,
        },
      };
    }
    await userSessionService.refreshContactInfo();
    return {
      success: true,
    };
  } catch (error) {
    return {
      success: false,
      error: {
        code: EditContactInfoErrorCode.UNKNOWN_ERROR,
      },
    };
  }
}
