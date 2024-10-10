import {
  RefreshContactInfoErrorCode,
  RefreshContactInfoResult,
} from "@dashlane/communication";
import { CoreServices } from "Services";
export async function refreshContactInfoHandler(
  services: CoreServices
): Promise<RefreshContactInfoResult> {
  try {
    const { sessionService } = services;
    const { user: userSessionService } = sessionService.getInstance();
    await userSessionService.refreshContactInfo();
    return {
      success: true,
    };
  } catch (error) {
    return {
      success: false,
      error: {
        code: RefreshContactInfoErrorCode.UNKNOWN_ERROR,
      },
    };
  }
}
