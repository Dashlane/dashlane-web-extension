import { useEffect, useState } from "react";
import { Dialog, Infobox, Paragraph, useToast } from "@dashlane/design-system";
import {
  AuditLogDownloadError,
  FlowStep,
  UserDownloadAuditLogsDataEvent,
} from "@dashlane/hermes";
import { ActivityLog } from "@dashlane/risk-monitoring-contracts";
import useTranslate from "../../../../libs/i18n/useTranslate";
import { downloadFile } from "../../../../libs/file-download/file-download";
import { logEvent } from "../../../../libs/logs/logEvent";
import { getAuditLogsCSVContent } from "./getAuditLogsCSVContent";
import { DownloadProgress } from "./download-progress";
export const I18N_KEYS = {
  DOWNLOAD_MODAL_BODY: "team_activity_download_modal_body",
  DOWNLOAD_MODAL_TITLE: "team_activity_download_modal_title",
  DOWNLOAD_MODAL_WARNING: "team_activity_download_modal_warning",
  CLOSE: "_common_dialog_dismiss_button",
  GENERIC_ERROR: "_common_generic_error",
};
const CSV_MAX_RESULTS = 1000;
interface DownloadCSVDialogGrapheneProps {
  isOpen: boolean;
  areLogsLoading: boolean;
  hasMoreLogs: boolean;
  logs: ActivityLog[];
  loadMoreLogs: (maxResults?: number) => void;
  onClose: () => void;
}
export const DownloadCSVDialogGraphene = ({
  isOpen,
  areLogsLoading,
  hasMoreLogs,
  logs,
  loadMoreLogs,
  onClose,
}: DownloadCSVDialogGrapheneProps) => {
  const [progress, setProgress] = useState(0);
  const { translate } = useTranslate();
  const { showToast } = useToast();
  const handleCloseDialog = () => {
    onClose();
    setProgress(0);
  };
  useEffect(() => {
    if (!isOpen || areLogsLoading) {
      return;
    }
    if (hasMoreLogs) {
      setProgress(progress < 80 ? progress + 20 : progress);
      loadMoreLogs(CSV_MAX_RESULTS);
      return;
    }
    setProgress(100);
    const UTF8_BOM = "\ufeff";
    const csv = getAuditLogsCSVContent(logs, translate, true);
    try {
      downloadFile(
        [UTF8_BOM, csv],
        "dashlane-activity-export.csv",
        "text/csv;charset=utf-8"
      );
      setTimeout(handleCloseDialog, 2000);
    } catch (e) {
      showToast({
        mood: "danger",
        description: translate(I18N_KEYS.GENERIC_ERROR),
      });
      logEvent(
        new UserDownloadAuditLogsDataEvent({
          flowStep: FlowStep.Error,
          auditLogDownloadError: AuditLogDownloadError.NoCsv,
        })
      );
    }
  }, [isOpen, hasMoreLogs, areLogsLoading, logs]);
  return (
    <div>
      <Dialog
        isOpen={isOpen}
        closeActionLabel={translate(I18N_KEYS.CLOSE)}
        onClose={handleCloseDialog}
        title={translate(I18N_KEYS.DOWNLOAD_MODAL_TITLE)}
      >
        <div
          sx={{
            maxHeight: "fit-content",
            overflowX: "hidden",
            overflowY: "auto",
          }}
        >
          <DownloadProgress progressPercent={progress} />

          <Paragraph
            textStyle="ds.body.standard.regular"
            color="ds.text.neutral.quiet"
            sx={{ margin: "16px 0" }}
          >
            {translate(I18N_KEYS.DOWNLOAD_MODAL_BODY)}
          </Paragraph>
          <Infobox
            mood="neutral"
            size="small"
            title={translate(I18N_KEYS.DOWNLOAD_MODAL_WARNING)}
          />
        </div>
      </Dialog>
    </div>
  );
};
