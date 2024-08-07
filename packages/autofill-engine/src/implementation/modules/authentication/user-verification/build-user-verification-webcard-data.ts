import { UserVerificationMethods } from "@dashlane/communication";
import { AutofillEngineContext } from "../../../../Api/server/context";
import {
  NeverAskAgainMode,
  PendingOperation,
  UserVerificationUsageLogDetails,
  UserVerificationWebcardData,
  WebcardMetadataType,
  WebcardType,
} from "../../../../types";
import { PendingOperationWebcardMetadata } from "../../../commands/private-types";
import { v4 as uuidv4 } from "uuid";
export async function buildUserVerificationWebcardData(
  context: AutofillEngineContext,
  pendingOperation: PendingOperation,
  usageLogDetails: UserVerificationUsageLogDetails,
  webcardId: string = uuidv4()
): Promise<UserVerificationWebcardData> {
  const availableMethods =
    await context.connectors.carbon.getAvailableUserVerificationMethods();
  const methodsPreferenceOrder = [
    UserVerificationMethods.Webauthn,
    UserVerificationMethods.MasterPassword,
  ];
  const defaultMethod = methodsPreferenceOrder.find((method) =>
    availableMethods.includes(method)
  );
  const pendingOperationMetadata: PendingOperationWebcardMetadata = {
    type: WebcardMetadataType.PendingOperation,
    operation: pendingOperation,
  };
  const webcard: UserVerificationWebcardData = {
    webcardType: WebcardType.UserVerification,
    webcardId,
    formType: "login",
    neverAskAgainMode: NeverAskAgainMode.None,
    userLogin: (await context.connectors.carbon.getUserLogin()) ?? "",
    availableMethods,
    defaultMethod,
    usageLogDetails,
    metadata: {
      [WebcardMetadataType.PendingOperation]: pendingOperationMetadata,
    },
  };
  return webcard;
}
