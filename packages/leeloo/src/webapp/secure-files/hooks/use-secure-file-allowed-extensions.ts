import { DataStatus, useCarbonEndpoint } from "@dashlane/carbon-api-consumers";
import { carbonConnector } from "../../../libs/carbon/connector";
export function useSecureFileAllowedExtensions() {
  const secureFilesExtensionsList = useCarbonEndpoint<undefined, string[]>(
    {
      queryConfig: {
        query: carbonConnector.getSecureDocumentsExtensionsList,
      },
    },
    []
  );
  return secureFilesExtensionsList.status === DataStatus.Success
    ? secureFilesExtensionsList.data
    : undefined;
}
