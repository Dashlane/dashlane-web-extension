import { SecureFileUploadProgress } from "@dashlane/communication";
import { State } from "Store";
export const secureFileUploadSelector = (
  state: State
): SecureFileUploadProgress => {
  return state.userSession.secureFileStorageState.upload;
};
