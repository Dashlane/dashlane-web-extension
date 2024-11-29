import { useState } from "react";
import {
  AddSecureFileResult,
  SecureFileResultErrorCode,
} from "@dashlane/communication";
import {
  Action,
  ItemType,
  UserUpdateVaultItemAttachmentEvent,
} from "@dashlane/hermes";
import { AlertSeverity } from "@dashlane/ui-components";
import { carbonConnector } from "../../../libs/carbon/connector";
import { logEvent } from "../../../libs/logs/logEvent";
import { useAlert } from "../../../libs/alert-notifications/use-alert";
import { useTranslateWithMarkup } from "../../../libs/i18n/useTranslateWithMarkup";
import { formatName } from "../helpers/filename-format";
import { wrapWithLoadingIcon } from "../helpers/alert-text";
const MAX_FILE_SIZE = Math.pow(1024, 2) * 15;
const I18N_KEYS = {
  PROGRESS_CIPHERING: "webapp_secure_file_upload_progress_ciphering_markup",
};
async function onFileLoad(
  fileReader: FileReader,
  file: File,
  itemType: ItemType,
  callback?: (result: AddSecureFileResult) => void
) {
  if (fileReader.readyState === 2) {
    const arrayBuffer = fileReader.result as ArrayBuffer;
    const bytesArray = new Uint8Array(arrayBuffer);
    const serializedContent = JSON.stringify(Array.from(bytesArray));
    if (file.size > MAX_FILE_SIZE) {
      callback?.({
        success: false,
        error: {
          code: SecureFileResultErrorCode.MAX_CONTENT_LENGTH_EXCEEDED,
        },
      });
    } else {
      const res = await carbonConnector.addSecureFile({
        fileName: file.name,
        fileType: file.type,
        serializedContent,
      });
      if (res.success) {
        logEvent(
          new UserUpdateVaultItemAttachmentEvent({
            attachmentAction: Action.Add,
            itemId: res.secureFileInfo.Id,
            itemType: itemType,
          })
        );
      }
      callback?.(res);
    }
  }
  return null;
}
export function useSecureFileUpload(itemType: ItemType) {
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const alert = useAlert();
  const { translateWithMarkup } = useTranslateWithMarkup();
  return {
    isUploading,
    upload: (
      file?: File | null,
      callback?: (result: AddSecureFileResult) => void
    ) => {
      if (file) {
        if (file.size > MAX_FILE_SIZE) {
          callback?.({
            success: false,
            error: {
              code: SecureFileResultErrorCode.MAX_CONTENT_LENGTH_EXCEEDED,
            },
          });
        } else {
          const displayName = formatName(file.name);
          alert.showAlert(
            wrapWithLoadingIcon(
              translateWithMarkup({
                key: I18N_KEYS.PROGRESS_CIPHERING,
                params: {
                  fileName: displayName,
                },
              })
            ),
            AlertSeverity.SUBTLE,
            false
          );
          setIsUploading(true);
          const fileReader = new FileReader();
          const onceFinished: (result: AddSecureFileResult) => void = (
            result
          ) => {
            callback?.(result);
            setIsUploading(false);
          };
          fileReader.onloadend = async () =>
            onFileLoad(fileReader, file, itemType, onceFinished);
          fileReader.readAsArrayBuffer(file);
        }
      }
    },
  };
}
