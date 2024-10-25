import { ExceptionCriticality } from "@dashlane/communication";
import { StoreService } from "Store";
import { CredentialsDedupViewUpdatedAction } from "./Store/credentialsDedupView/types";
import { getDefaultCredentialsDedupView } from "./Store/credentialsDedupView/reducer";
import { getFeatureFlip } from "Libs/DashlaneApi/services/features/get-and-evaluate-for-users";
import { isApiError } from "Libs/DashlaneApi";
import { credentialsDedupViewUpdated } from "./Store/credentialsDedupView/actions";
import { sendExceptionLog } from "Logs/Exception";
export async function refreshCredentialsDedupView(
  storeService: StoreService,
  login: string
): Promise<CredentialsDedupViewUpdatedAction> {
  try {
    const credentialsDedupViewFF = "web_extension_credentialsDedupView";
    const result = await getFeatureFlip(
      storeService,
      login,
      credentialsDedupViewFF
    );
    if (isApiError(result)) {
      sendExceptionLog({
        error: new Error("Failed to get credentialsDedupView value"),
        code: ExceptionCriticality.WARNING,
      });
      return storeService.dispatch(
        credentialsDedupViewUpdated(getDefaultCredentialsDedupView())
      );
    }
    return storeService.dispatch(
      credentialsDedupViewUpdated({
        credentialsDedupView:
          result.enabledFeatures[0] === credentialsDedupViewFF,
      })
    );
  } catch (e) {
    sendExceptionLog({
      error: new Error(`Failed to refreshCredentialsDedupView: ${e.message}`),
      code: ExceptionCriticality.WARNING,
    });
    return storeService.dispatch(
      credentialsDedupViewUpdated(getDefaultCredentialsDedupView())
    );
  }
}
