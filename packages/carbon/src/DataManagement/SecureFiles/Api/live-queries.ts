import { SecureFileUploadProgress } from "@dashlane/communication";
import { LiveQuery } from "Shared/Api";
export type SecureFileLiveQueries = {
  liveFileUploadProgress: LiveQuery<void, SecureFileUploadProgress>;
};
