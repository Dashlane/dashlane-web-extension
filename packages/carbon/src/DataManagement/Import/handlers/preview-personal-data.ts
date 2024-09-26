import {
  PreviewPersonalDataErrorType,
  PreviewPersonalDataRequest,
  PreviewPersonalDataResult,
} from "@dashlane/communication";
import { CoreServices } from "Services";
import { ImportInfrastructure, makeImportService } from "../services/import";
export const previewPersonalData = async (
  service: ImportInfrastructure,
  command: PreviewPersonalDataRequest
): Promise<PreviewPersonalDataResult> => {
  if (!service.canDoImport()) {
    return {
      success: false,
      error: PreviewPersonalDataErrorType.Unavailable,
    };
  }
  try {
    return await service.previewPersonalDataArchive(command);
  } catch (error) {
    return {
      success: false,
      error: PreviewPersonalDataErrorType.InvalidFormat,
    };
  }
};
export const previewPersonalDataHandler = (
  coreServices: CoreServices,
  command: PreviewPersonalDataRequest
): Promise<PreviewPersonalDataResult> => {
  const service = makeImportService(coreServices);
  return previewPersonalData(service, command);
};
