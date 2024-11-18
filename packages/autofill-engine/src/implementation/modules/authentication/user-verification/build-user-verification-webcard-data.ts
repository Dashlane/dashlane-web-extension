import { UserVerificationMethods } from "@dashlane/authentication-contracts";
import { AutofillEngineContext } from "../../../../Api/server/context";
import {
  NeverAskAgainMode,
  UserVerificationUsageLogDetails,
  UserVerificationWebcardData,
  WebcardMetadataType,
  WebcardType,
} from "../../../../types";
import {
  PendingOperation,
  PendingOperationWebcardMetadata,
} from "../../../commands/private-types";
import { getAvailableUserVerificationMethods } from "./get-available-user-verification-methods";
import { v4 as uuidv4 } from "uuid";
export async function buildUserVerificationWebcardData(
  context: AutofillEngineContext,
  pendingOperation: PendingOperation,
  usageLogDetails: UserVerificationUsageLogDetails,
  webcardId: string = uuidv4()
): Promise<UserVerificationWebcardData> {
  const availableMethods = await getAvailableUserVerificationMethods(context);
  const methodsPreferenceOrder = [
    UserVerificationMethods.Biometrics,
    UserVerificationMethods.Pin,
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
