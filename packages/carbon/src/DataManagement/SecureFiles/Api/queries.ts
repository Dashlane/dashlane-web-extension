import { SecureFileUploadProgress } from "@dashlane/communication";
import { Query } from "Shared/Api";
export type SecureFileInfoQueries = {
  getFileUploadProgress: Query<void, SecureFileUploadProgress>;
};
