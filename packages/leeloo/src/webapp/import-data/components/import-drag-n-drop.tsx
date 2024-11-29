import { HTMLAttributes, ReactNode, useState } from "react";
import { Fragment } from "@dashlane/design-system/jsx-runtime";
import { FileRejection, useDropzone } from "react-dropzone";
import {
  Flex,
  Icon,
  Paragraph,
  ThemeUIStyleObject,
} from "@dashlane/design-system";
import { ImportSource } from "@dashlane/communication";
import {
  BackupFileType,
  ImportDataStatus,
  ImportDataStep,
  UserImportDataEvent,
} from "@dashlane/hermes";
import useTranslate from "../../../libs/i18n/useTranslate";
import { logEvent } from "../../../libs/logs/logEvent";
import { ImportSourcesToLogSources } from "../types";
export interface DragNDropProps {
  onFileDropped: (file: File) => void;
  undoFileDropped?: () => void;
  setErrorMessage: (message: ReactNode) => void;
  error: ReactNode;
  accept: string[];
  idleMessage: ReactNode;
  fileSelectedMessage?: string;
  setFileInvalid: (isValid: boolean) => void;
  importSource: ImportSource;
}
const fileLinkStyle: ThemeUIStyleObject = {
  cursor: "pointer",
  color: "ds.text.brand.standard",
  transition: "all 300ms ease",
  textDecoration: "underline",
};
const dragDropTextStyle: ThemeUIStyleObject = {
  margin: "0px 8px",
  color: "ds.text.neutral.quiet",
  "& em": fileLinkStyle,
};
const dragDropErrorTextStyle: ThemeUIStyleObject = {
  color: "ds.text.danger.quiet",
  "& em": fileLinkStyle,
};
const dropZoneStyle: ThemeUIStyleObject = {
  textAlign: "center",
  width: "100%",
  paddingTop: "72px",
  paddingBottom: "72px",
  backgroundColor: "ds.container.expressive.neutral.quiet.idle",
  borderRadius: "4px",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  border: "none",
  "* > em": {
    fontStyle: "initial",
  },
};
const dropZoneStyleDrag: ThemeUIStyleObject = {
  ...dropZoneStyle,
  backgroundColor: "ds.container.expressive.neutral.quiet.hover",
};
const I18N_KEYS = {
  NO_MULTIPLE_FILES:
    "webapp_import_chrome_on_import_multi_error_message_markup",
  NOT_COMPATIBLE_FILE: "webapp_import_chrome_on_import_error_message_markup",
  FILE_READY: "webapp_import_chrome_file_ready",
  CANCEL_FILE_ARIA: "_common_action_cancel",
  FILE_INVALID_CSV: "webapp_import_invalid_file_error_markup",
  FILE_INVALID_DASH: "webapp_import_invalid_dash_file_error_markup",
};
export const ImportDragNDrop = ({
  accept,
  idleMessage,
  fileSelectedMessage,
  onFileDropped,
  undoFileDropped,
  setErrorMessage,
  error = "",
  setFileInvalid,
  importSource,
}: DragNDropProps) => {
  const { translate } = useTranslate();
  const [loadedFiles, setLoadedFiles] = useState<string[]>([]);
  const fileType = accept.includes(".dash")
    ? BackupFileType.SecureVault
    : BackupFileType.Csv;
  const handleReset = () => {
    undoFileDropped?.();
    setLoadedFiles([]);
  };
  const handleAcceptedFiles = (files: File[]) => {
    if (files.length !== 1) {
      logEvent(
        new UserImportDataEvent({
          backupFileType: fileType,
          importDataStatus: ImportDataStatus.MultipleFilesSelected,
          importSource: ImportSourcesToLogSources[importSource],
          importDataStep: ImportDataStep.SelectFile,
          isDirectImport: false,
        })
      );
      setErrorMessage(translate.markup(I18N_KEYS.NO_MULTIPLE_FILES));
      setFileInvalid(true);
      return;
    }
    const file = files[0];
    setLoadedFiles([file].map((f) => f.name));
    setErrorMessage(null);
    setFileInvalid(false);
    try {
      onFileDropped(file);
    } catch (e) {
      setErrorMessage(translate.markup(I18N_KEYS.NOT_COMPATIBLE_FILE));
      logEvent(
        new UserImportDataEvent({
          backupFileType: fileType,
          importDataStatus: ImportDataStatus.WrongFileFormat,
          importSource: ImportSourcesToLogSources[importSource],
          importDataStep: ImportDataStep.SelectFile,
          isDirectImport: false,
        })
      );
      setFileInvalid(true);
    }
  };
  const handleRejectedFiles = (files: FileRejection[]) => {
    handleReset();
    if (files.length > 1) {
      logEvent(
        new UserImportDataEvent({
          backupFileType: fileType,
          importDataStatus: ImportDataStatus.MultipleFilesSelected,
          importSource: ImportSourcesToLogSources[importSource],
          importDataStep: ImportDataStep.SelectFile,
          isDirectImport: false,
        })
      );
      setErrorMessage(translate.markup(I18N_KEYS.NO_MULTIPLE_FILES));
    } else {
      if (importSource === "dash") {
        setErrorMessage(translate.markup(I18N_KEYS.FILE_INVALID_DASH));
      } else {
        setErrorMessage(translate.markup(I18N_KEYS.FILE_INVALID_CSV));
      }
      logEvent(
        new UserImportDataEvent({
          backupFileType: fileType,
          importDataStatus: ImportDataStatus.WrongFileFormat,
          importSource: ImportSourcesToLogSources[importSource],
          importDataStep: ImportDataStep.SelectFile,
          isDirectImport: false,
        })
      );
    }
    setFileInvalid(true);
  };
  const nextStepReadyMessage =
    fileSelectedMessage ?? translate(I18N_KEYS.FILE_READY);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept,
    multiple: false,
    onDropAccepted: handleAcceptedFiles,
    onDropRejected: handleRejectedFiles,
    noClick: loadedFiles.length > 0 && !error,
  });
  return (
    <div
      {...getRootProps<HTMLAttributes<HTMLDivElement>>()}
      sx={{
        padding: "8px",
        overflow: "hidden",
        border: "2px dashed",
        borderColor: "ds.border.neutral.standard.idle",
        borderRadius: "4px",
      }}
      role="button"
    >
      <div sx={isDragActive ? dropZoneStyleDrag : dropZoneStyle}>
        <input
          id="dropzoneinput"
          aria-labelledby="dropzoneinput-label"
          {...getInputProps()}
        />
        {!error && loadedFiles.length === 0 ? (
          <Paragraph as="span" id="dropzoneinput-label" sx={dragDropTextStyle}>
            {idleMessage}
          </Paragraph>
        ) : null}
        {!error && loadedFiles?.length > 0 ? (
          <Flex flexDirection="column" alignItems="center">
            {loadedFiles?.map((file) => {
              return (
                <Fragment key={file}>
                  <Paragraph color="ds.text.neutral.quiet">
                    {nextStepReadyMessage}
                  </Paragraph>
                  <Flex
                    as={Paragraph}
                    alignItems="center"
                    gap="4px"
                    color="ds.text.brand.standard"
                    size="medium"
                    bold
                  >
                    {file}
                    <Icon
                      name="ActionCloseOutlined"
                      aria-label={translate(I18N_KEYS.CANCEL_FILE_ARIA)}
                      size="xsmall"
                      onClick={handleReset}
                      color="ds.text.brand.standard"
                      sx={{ cursor: "pointer" }}
                    />
                  </Flex>
                </Fragment>
              );
            })}
          </Flex>
        ) : null}
        {error ? (
          <>
            <Icon
              name="FeedbackFailOutlined"
              size="xlarge"
              color={"ds.text.danger.quiet"}
            />
            <br />
            <Paragraph sx={dragDropErrorTextStyle}>{error}</Paragraph>
          </>
        ) : null}
      </div>
    </div>
  );
};
