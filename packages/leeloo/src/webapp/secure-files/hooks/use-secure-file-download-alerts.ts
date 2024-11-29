import { AlertSeverity } from "@dashlane/ui-components";
import { useAlert } from "../../../libs/alert-notifications/use-alert";
import { TranslationOptions } from "../../../libs/i18n/types";
import { useTranslateWithMarkup } from "../../../libs/i18n/useTranslateWithMarkup";
import { useCallback, useEffect, useRef } from "react";
import { wrapWithLoadingIcon } from "../helpers/alert-text";
import { DataStatus, useModuleQuery } from "@dashlane/framework-react";
import { ProgressStatus, secureFilesApi } from "@dashlane/vault-contracts";
const ONE_MINUTE = 60 * 1000;
export const I18N_KEYS = {
  PROGRESS_DOWNLOADING:
    "webapp_secure_file_download_progress_downloading_markup",
  PROGRESS_DECIPHERING:
    "webapp_secure_file_download_progress_deciphering_markup",
  DOWNLOAD_SUCCESS: "webapp_secure_file_download_progress_success_markup",
  ERROR: "webapp_secure_file_error_unknown",
};
function useStableAlert() {
  const { showAlert } = useAlert();
  const showAlertRef = useRef(showAlert);
  return { showAlert: showAlertRef.current };
}
function useAlertWithLoader() {
  const { showAlert } = useStableAlert();
  const { translateWithMarkup } = useTranslateWithMarkup();
  return useCallback(
    (translationOptions: TranslationOptions) =>
      showAlert(
        wrapWithLoadingIcon(translateWithMarkup(translationOptions)),
        AlertSeverity.SUBTLE,
        false,
        undefined,
        undefined,
        ONE_MINUTE
      ),
    [showAlert, translateWithMarkup]
  );
}
type UseSecureFileDownloadAlertsProps = {
  filename: string;
  downloadKey: string;
};
export function useSecureFileDownloadAlerts({
  filename: fileName,
  downloadKey,
}: UseSecureFileDownloadAlertsProps) {
  const { translateWithMarkup } = useTranslateWithMarkup();
  const { showAlert } = useStableAlert();
  const showAlertWithLoader = useAlertWithLoader();
  const { data: progressStatus, status } = useModuleQuery(
    secureFilesApi,
    "secureFileProgress",
    {
      secureFileKey: downloadKey,
    }
  );
  useEffect(() => {
    if (
      status !== DataStatus.Success ||
      progressStatus === ProgressStatus.NotStarted
    ) {
      return;
    }
    switch (progressStatus) {
      case ProgressStatus.Started:
        showAlertWithLoader({
          key: I18N_KEYS.PROGRESS_DOWNLOADING,
          params: {
            fileName,
            progress: 0,
          },
        });
        break;
      case ProgressStatus.Linked:
        showAlertWithLoader({
          key: I18N_KEYS.PROGRESS_DOWNLOADING,
          params: {
            fileName,
            progress: 10,
          },
        });
        break;
      case ProgressStatus.Fetched:
        showAlertWithLoader({
          key: I18N_KEYS.PROGRESS_DOWNLOADING,
          params: {
            fileName,
            progress: 70,
          },
        });
        break;
      case ProgressStatus.Ciphered:
        showAlertWithLoader({
          key: I18N_KEYS.PROGRESS_DECIPHERING,
          params: {
            fileName,
          },
        });
        break;
      case ProgressStatus.Completed:
        showAlert(
          translateWithMarkup({
            key: I18N_KEYS.DOWNLOAD_SUCCESS,
            params: {
              fileName,
            },
          }),
          AlertSeverity.SUCCESS
        );
        break;
      case ProgressStatus.Error:
        showAlert(
          translateWithMarkup({
            key: I18N_KEYS.ERROR,
          }),
          AlertSeverity.ERROR
        );
        break;
      default:
        break;
    }
  }, [
    progressStatus,
    fileName,
    showAlert,
    showAlertWithLoader,
    status,
    translateWithMarkup,
  ]);
}
