import {
  SecureFileResultErrorCode,
  ValidateSecureFileRequest,
  ValidateSecureFileResult,
} from "@dashlane/communication";
import { CoreServices } from "Services";
import { validateSecureFile } from "../services/validateSecureFile";
export async function validateSecureFileHandler(
  services: CoreServices,
  params: ValidateSecureFileRequest
): Promise<ValidateSecureFileResult> {
  if (validateSecureFile(params.fileName, params.fileType)) {
    return { success: true };
  }
  return {
    success: false,
    error: {
      code: SecureFileResultErrorCode.INVALID_FILE_TYPE,
    },
  };
}
