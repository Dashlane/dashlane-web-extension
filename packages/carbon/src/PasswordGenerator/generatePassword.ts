import {
  GenerateAndSavePasswordRequest,
  GeneratePasswordRequest,
  GeneratePasswordResult,
} from "@dashlane/communication";
import { evaluatePasswordStrength } from "Health/Strength/evaluatePasswordStrength";
import { logError } from "Logs/Debugger";
import { sendExceptionLog } from "Logs/Exception";
import { CoreServices } from "Services";
import { makeSessionController } from "Session/SessionController";
export async function generatePasswordHandler(
  coreServices: CoreServices,
  request: GeneratePasswordRequest
): Promise<GeneratePasswordResult> {
  try {
    const sessionController = makeSessionController(coreServices);
    const generatedPassword = sessionController.generatePassword(
      request.settings
    );
    const strength = await evaluatePasswordStrength(generatedPassword);
    return {
      success: true,
      password: generatedPassword,
      strength,
    };
  } catch (error) {
    logError(error);
    sendExceptionLog({ error });
    return { success: false };
  }
}
export async function generateAndSavePasswordHandler(
  coreServices: CoreServices,
  request: GenerateAndSavePasswordRequest
): Promise<GeneratePasswordResult> {
  try {
    const sessionController = makeSessionController(coreServices);
    const generatedPassword = sessionController.generateAndSavePassword(
      request.url
    );
    const strength = await evaluatePasswordStrength(generatedPassword);
    return {
      success: true,
      password: generatedPassword,
      strength,
    };
  } catch (error) {
    logError(error);
    sendExceptionLog({ error });
    return { success: false };
  }
}
