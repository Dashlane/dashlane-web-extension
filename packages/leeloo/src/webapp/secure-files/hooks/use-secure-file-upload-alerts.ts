import { FileUploadStatus } from "@dashlane/communication";
import { AlertSeverity } from "@dashlane/ui-components";
import { useAlert } from "../../../libs/alert-notifications/use-alert";
import { TranslationOptions } from "../../../libs/i18n/types";
import { useEffect } from "react";
import { wrapWithLoadingIcon } from "../helpers/alert-text";
import { formatName } from "../helpers/filename-format";
import { useSecureFileUploadProgress } from "./use-secure-file-upload-progress";
import { useSecureFilesQuota } from "./use-secure-files-quota";
import { formatQuota } from "../helpers/quota";
import useTranslate from "../../../libs/i18n/useTranslate";
const I18N_KEYS = {
  PROGRESS_UPLOADING: "webapp_secure_file_upload_progress_loading_markup",
  PROGRESS_CIPHERING: "webapp_secure_file_upload_progress_ciphering_markup",
  UPLOAD_SUCCESS: "webapp_secure_file_upload_success_markup",
  UNKNOWN_ERROR: "webapp_secure_file_error_unknown",
  MAX_CONTENT_LENGTH_EXCEEDED:
    "webapp_secure_file_error_upload_max_length_excedeed",
  QUOTA_EXCEEDED: "webapp_secure_file_error_upload_quota_excedeed",
  INVALID_FILE_TYPE: "webapp_secure_file_error_file_type_not_allowed",
};
const getErrorMessage = (errorCode?: string) => {
  if (errorCode) {
    return I18N_KEYS[errorCode] ?? I18N_KEYS.UNKNOWN_ERROR;
  } else {
    return I18N_KEYS.UNKNOWN_ERROR;
  }
};
export const useSecureFileUploadAlerts = (fileName: string) => {
  const alert = useAlert();
  const { translate } = useTranslate();
  const secureFilesQuota = useSecureFilesQuota();
  const fileUploadProgress = useSecureFileUploadProgress();
  const displayName = formatName(fileName);
  useEffect(() => {
    const showAlertWithLoader = (options: TranslationOptions) =>
      alert.showAlert(
        wrapWithLoadingIcon(translate.markup(options.key, options.params)),
        AlertSeverity.SUBTLE,
        false
      );
    switch (fileUploadProgress?.status) {
      case FileUploadStatus.Uploading:
        showAlertWithLoader({
          key: I18N_KEYS.PROGRESS_UPLOADING,
          params: {
            fileName: displayName,
            progress: Math.round(
              (100 * fileUploadProgress?.bytesSent ?? 0) /
                fileUploadProgress?.contentLength ?? 1
            ),
          },
        });
        break;
      case FileUploadStatus.Ciphering:
        showAlertWithLoader({
          key: I18N_KEYS.PROGRESS_CIPHERING,
          params: {
            fileName: displayName,
          },
        });
        break;
      case FileUploadStatus.Done:
        alert.showAlert(
          translate.markup(I18N_KEYS.UPLOAD_SUCCESS, { fileName: displayName }),
          AlertSeverity.SUCCESS
        );
        break;
    }
  }, [alert, fileName, fileUploadProgress]);
  return {
    showErrorAlert: (errorCode: string | undefined) => {
      alert.showAlert(
        translate(getErrorMessage(errorCode ?? ""), {
          usedQuota: formatQuota(
            secureFilesQuota.remaining,
            secureFilesQuota.max
          ).usedQuota,
        }),
        AlertSeverity.ERROR
      );
    },
  };
};
