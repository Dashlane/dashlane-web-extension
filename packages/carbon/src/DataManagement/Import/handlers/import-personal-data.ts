import {
  ImportPersonalDataErrorType,
  ImportPersonalDataRequest,
  ImportPersonalDataResult,
  ImportPersonalDataStateType,
} from "@dashlane/communication";
import { logError } from "Logs/Debugger";
import { sendExceptionLog } from "Logs/Exception";
import { CoreServices } from "Services";
import { ImportInfrastructure, makeImportService } from "../services/import";
export const importPersonalData = async (
  infrastructure: ImportInfrastructure,
  command: ImportPersonalDataRequest
): Promise<ImportPersonalDataResult> => {
  try {
    infrastructure.onNewState({
      status: ImportPersonalDataStateType.Processing,
      name: command.name,
    });
    const personalData = command.content;
    const asyncProcess = async () => {
      try {
        const result = await infrastructure.importPersonalDataItems(
          personalData
        );
        infrastructure.onNewState({
          status: ImportPersonalDataStateType.Success,
          name: command.name,
          totalCount: result.totalCount,
          successCount: result.successCount,
          duplicateCount: result.duplicateCount,
        });
      } catch (error) {
        const message = `[import] - importError: ${error}`;
        const augmentedError = new Error(message);
        sendExceptionLog({ error: augmentedError });
        logError(augmentedError);
        infrastructure.onNewState({
          status: ImportPersonalDataStateType.Error,
          name: command.name,
        });
      }
    };
    asyncProcess();
    return { success: true };
  } catch (error) {
    const message = `[import] - formatError: ${error}`;
    const augmentedError = new Error(message);
    sendExceptionLog({ error: augmentedError });
    logError(augmentedError);
    infrastructure.onNewState({
      status: ImportPersonalDataStateType.Error,
      name: command.name,
    });
    return {
      success: false,
      error: ImportPersonalDataErrorType.Unknown,
    };
  }
};
export const importPersonalDataHandler = (
  coreServices: CoreServices,
  command: ImportPersonalDataRequest
): Promise<ImportPersonalDataResult> => {
  return importPersonalData(makeImportService(coreServices), command);
};
