import { useState } from "react";
import {
  ImportFormats,
  ImportSource,
  PreviewPersonalDataErrorType,
  PreviewPersonalDataRequest,
  PreviewPersonalDataResult,
} from "@dashlane/communication";
import { carbonConnector } from "../../../libs/carbon/connector";
import { assertUnreachable } from "../../../libs/assert-unreachable";
import { logWrongDashArchivePassword } from "../logs";
import { getFileContents, getImportFileFormat } from "../preview-helpers";
export interface UsePreviewData {
  processFile: (newFile: File) => void;
  previewFile: (
    importSource: ImportSource,
    password?: string
  ) => Promise<PreviewPersonalDataResult>;
  resetState: () => void;
  setAttemptedCount: (value: ((prevState: number) => number) | number) => void;
  state: {
    fileName: string;
    file: File | null;
    requiresPassword: boolean;
    format: ImportFormats | null;
    attemptedItemCount: number;
  };
}
export const usePreviewData = (): UsePreviewData => {
  const [file, setFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState("");
  const [format, setFormat] = useState<ImportFormats | null>(null);
  const [requiresPassword, setRequiresPassword] = useState(false);
  const [attemptedItemCount, setAttemptedCount] = useState<number>(0);
  const processFile = (newFile: File) => {
    const fileFormat = getImportFileFormat(newFile);
    setFile(newFile);
    setFormat(fileFormat);
    setFileName(newFile.name);
    if (fileFormat === ImportFormats.Dash) {
      setRequiresPassword(true);
    }
  };
  const makePreviewCommand = async (
    importSource: ImportSource,
    password?: string
  ): Promise<PreviewPersonalDataRequest> => {
    if (!format || !file || !fileName) {
      throw new Error("Need to process file first");
    }
    const fileContents = await getFileContents(file);
    switch (format) {
      case ImportFormats.Csv: {
        return {
          content: {
            importSource: importSource,
            data: fileContents,
          },
          format,
          name: fileName,
        };
      }
      case ImportFormats.Dash: {
        if (!password) {
          throw new Error("Password required for DASH file");
        }
        return {
          content: {
            importSource: importSource,
            data: fileContents,
          },
          format,
          name: fileName,
          password,
        };
      }
      default:
        assertUnreachable(format);
    }
  };
  const previewFile = async (
    importSource: ImportSource,
    password?: string
  ): Promise<PreviewPersonalDataResult> => {
    const command = await makePreviewCommand(importSource, password);
    const result = await carbonConnector.previewPersonalData(command);
    if (!result.success) {
      if (
        format === ImportFormats.Dash &&
        result.error === PreviewPersonalDataErrorType.BadPassword
      ) {
        logWrongDashArchivePassword();
      }
    }
    return result;
  };
  const resetState = () => {
    setFile(null);
    setFileName("");
    setFormat(null);
    setRequiresPassword(false);
    setAttemptedCount(0);
  };
  return {
    previewFile,
    processFile,
    resetState,
    setAttemptedCount,
    state: {
      format,
      fileName,
      file,
      requiresPassword,
      attemptedItemCount,
    },
  };
};
