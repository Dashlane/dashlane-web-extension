import { getSuccessOrThrow } from "@dashlane/framework-types";
import { AutofillEngineContext } from "../../../Api/server/context";
import {
  AutofillEngineActionsWithOptions,
  AutofillEngineActionTarget,
} from "../../abstractions/messaging/action-serializer";
import { getQueryValue } from "@dashlane/framework-application";
import { firstValueFrom } from "rxjs";
async function getPinRemainingAttempts(
  context: AutofillEngineContext
): Promise<number> {
  const pinCodeStatusResult = await getQueryValue(
    context.connectors.grapheneClient.pinCode.queries.getCurrentUserStatus()
  );
  const pinCodeStatus = getSuccessOrThrow(pinCodeStatusResult);
  if (!pinCodeStatus.isPinCodeEnabled) {
    return 0;
  }
  return pinCodeStatus.attemptsLeft;
}
export const validatePinCodeHandler = async (
  context: AutofillEngineContext,
  actions: AutofillEngineActionsWithOptions,
  _sender: chrome.runtime.MessageSender,
  pinCode: string
): Promise<void> => {
  try {
    const pinVerificationResult = await firstValueFrom(
      context.connectors.grapheneClient.pinCode.queries.isPinCodeCorrect({
        pinCode,
      })
    );
    const { isPinCodeCorrect } = getSuccessOrThrow(pinVerificationResult);
    const remainingAttempts = await getPinRemainingAttempts(context);
    actions.setPinCodeValidationResult(AutofillEngineActionTarget.SenderFrame, {
      success: true,
      isPinCodeCorrect,
      remainingAttempts,
    });
  } catch (error) {
    actions.setPinCodeValidationResult(AutofillEngineActionTarget.SenderFrame, {
      success: false,
    });
  }
};
