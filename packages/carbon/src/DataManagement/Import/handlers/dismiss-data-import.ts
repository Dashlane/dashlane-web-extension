import { ImportPersonalDataStateType } from "@dashlane/communication";
import { CoreServices } from "Services";
import { ImportInfrastructure, makeImportService } from "../services/import";
export const dismissDataImport = async (service: ImportInfrastructure) => {
  await service.waitReady();
  service.onNewState({
    status: ImportPersonalDataStateType.Idle,
  });
};
export const dismissDataImportHandler = (coreServices: CoreServices) => {
  return dismissDataImport(makeImportService(coreServices));
};
