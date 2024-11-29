import { useCallback, useEffect, useState } from "react";
import { BackupFileType } from "@dashlane/hermes";
import {
  ImportPersonalDataError,
  ImportPersonalDataRequest,
  ImportPersonalDataStartingSuccess,
  ImportPersonalDataState,
  ImportPersonalDataStateType,
  ImportSource,
} from "@dashlane/communication";
import { carbonConnector } from "../../../libs/carbon/connector";
import { ImportDataState, ImportDataStep } from "./types";
import { useImportDataCarbonStatus } from "./user-import-data-carbon-status";
import { assertUnreachable } from "../../../libs/assert-unreachable";
import { logImportFailure } from "../logs";
import { ImportMethod } from "../types";
export const toLocalState = (
  carbonStatus: ImportPersonalDataState
): ImportDataState => {
  switch (carbonStatus.status) {
    case ImportPersonalDataStateType.Error: {
      return {
        status: ImportDataStep.ERROR_GENERIC,
        name: carbonStatus.name,
      };
    }
    case ImportPersonalDataStateType.Idle: {
      return { status: ImportDataStep.IDLE };
    }
    case ImportPersonalDataStateType.Processing: {
      return { status: ImportDataStep.PROCESSING, name: carbonStatus.name };
    }
    case ImportPersonalDataStateType.Success: {
      return {
        status: ImportDataStep.SUCCESS,
        name: carbonStatus.name,
        totalCredentials: carbonStatus.totalCount,
        importedCredentials: carbonStatus.successCount,
        duplicateCredentials: carbonStatus.duplicateCount,
      };
    }
  }
  assertUnreachable(carbonStatus);
};
export interface UseImportData {
  startImport: (
    command: ImportPersonalDataRequest,
    source?: ImportSource,
    fileType?: BackupFileType,
    importMethod?: ImportMethod
  ) => Promise<ImportPersonalDataStartingSuccess | ImportPersonalDataError>;
  dismiss: () => void;
  state: ImportDataState;
}
export const useImportData = (): UseImportData => {
  const [state, setState] = useState<ImportDataState>({
    status: ImportDataStep.IDLE,
  });
  const carbonStatus = useImportDataCarbonStatus();
  useEffect(() => {
    if (!carbonStatus) {
      return;
    }
    const newState = toLocalState(carbonStatus);
    if (newState && state.status !== newState.status) {
      setState(newState);
    }
  }, [carbonStatus]);
  const startImport = useCallback(
    async (
      command: ImportPersonalDataRequest,
      source?: ImportSource,
      fileType?: BackupFileType,
      importMethod?: ImportMethod
    ) => {
      const result = await carbonConnector.importPersonalData(command);
      if (!result.success) {
        setState({
          status: ImportDataStep.ERROR_GENERIC,
          name: command.name,
        });
        if (fileType && source) {
          const isDirectImport = importMethod === ImportMethod.DIRECT;
          logImportFailure(
            fileType,
            source,
            command.content.length,
            isDirectImport
          );
        }
      }
      return result;
    },
    []
  );
  const dismiss = useCallback(() => {
    carbonConnector.dismissPersonalDataImportNotifications();
    setState({
      status: ImportDataStep.IDLE,
    });
  }, []);
  return {
    startImport,
    state,
    dismiss,
  };
};
