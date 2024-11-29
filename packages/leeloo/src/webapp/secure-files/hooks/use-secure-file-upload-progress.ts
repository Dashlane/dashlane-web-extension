import { carbonConnector } from "../../../libs/carbon/connector";
import { DataStatus, useCarbonEndpoint } from "@dashlane/carbon-api-consumers";
export function useSecureFileUploadProgress() {
  const fileUpoadProgress = useCarbonEndpoint(
    {
      queryConfig: {
        query: carbonConnector.getFileUploadProgress,
      },
      liveConfig: {
        live: carbonConnector.liveFileUploadProgress,
      },
    },
    []
  );
  return fileUpoadProgress.status === DataStatus.Success
    ? fileUpoadProgress.data
    : null;
}
