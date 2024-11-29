import { carbonConnector } from "../../../libs/carbon/connector";
export const clearSecureFileState = async (downloadKey?: string) => {
  return await carbonConnector.clearSecureFileState(downloadKey ?? "");
};
