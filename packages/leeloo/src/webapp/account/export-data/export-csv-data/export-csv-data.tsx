import { useState } from "react";
import {
  Button,
  Flex,
  Heading,
  Infobox,
  Paragraph,
} from "@dashlane/design-system";
import { AlertSeverity } from "@dashlane/ui-components";
import { useAlert } from "../../../../libs/alert-notifications/use-alert";
import { carbonConnector } from "../../../../libs/carbon/connector";
import { useProtectedItemsUnlocker } from "../../../unlock-items";
import { LockedItemType, UnlockerAction } from "../../../unlock-items/types";
import useTranslate from "../../../../libs/i18n/useTranslate";
import { ExportWarningDialog } from "../export-dialogs/export-warning/export-warning-dialog";
import { logEvent } from "../../../../libs/logs/logEvent";
import { downloadFile } from "../../../../libs/file-download/file-download";
import { BackupFileType, UserExportDataEvent } from "@dashlane/hermes";
import { dataURItoBlob } from "./utils";
const I18N_KEYS = {
  SUB_TITLE_CSV_EXPORT: "webapp_account_import_export_data_sub_title2_export",
  EXPORT_HELP_CSV_TEXT: "webapp_account_import_export_data_csv_help_text",
  HELP_WARNING_TEXT: "webapp_account_import_export_data_csv_warning_text",
  EXPORT_CSV_BUTTON: "webapp_account_import_export_data_csv_button",
  EXPORT_SUCCESS_MESSAGE:
    "webapp_account_import_export_data_csv_success_message",
};
export interface ExportCSVDataProps {
  reportError: (error: Error) => void;
}
export const ExportCSVData = ({ reportError }: ExportCSVDataProps) => {
  const { areProtectedItemsUnlocked, openProtectedItemsUnlocker } =
    useProtectedItemsUnlocker();
  const { translate } = useTranslate();
  const alert = useAlert();
  const [isWarningDialogOpen, setIsWarningDialogOpen] = useState(false);
  const exportCSVFile = async () => {
    const result = await carbonConnector.getPersonalDataExport({
      exportType: "csv",
    });
    if (!result.success) {
      reportError(new Error(`Cannot export CSV file : ${result.error.code}`));
      return;
    }
    const blob = dataURItoBlob(result.response.content);
    const arrayBuffer = await blob.arrayBuffer();
    downloadFile(arrayBuffer, result.response.filename, "application/zip");
    alert.showAlert(
      translate(I18N_KEYS.EXPORT_SUCCESS_MESSAGE),
      AlertSeverity.SUCCESS
    );
    logEvent(
      new UserExportDataEvent({
        backupFileType: BackupFileType.Csv,
      })
    );
  };
  const exportDataAsFile = async () => {
    const isForceDomainsEnabled =
      await carbonConnector.getIsForcedDomainsEnabled();
    if (!isForceDomainsEnabled) {
      exportCSVFile();
      return;
    }
    setIsWarningDialogOpen(true);
  };
  const onExportCSVData = () => {
    if (!areProtectedItemsUnlocked) {
      openProtectedItemsUnlocker({
        action: UnlockerAction.Export,
        options: {
          fieldsKeys: { confirm: "webapp_lock_items_export" },
          translated: false,
        },
        itemType: LockedItemType.ExportData,
        successCallback: exportDataAsFile,
      });
      return;
    }
    exportDataAsFile();
  };
  return (
    <div>
      <Flex
        sx={{
          padding: "0 16px",
          marginBottom: "24px",
        }}
      >
        <Heading
          as="h2"
          textStyle="ds.title.block.medium"
          color="ds.text.neutral.catchy"
          sx={{ marginTop: "16px" }}
        >
          {translate(I18N_KEYS.SUB_TITLE_CSV_EXPORT)}
        </Heading>
        <Paragraph
          textStyle="ds.body.standard.regular"
          color="ds.text.neutral.standard"
          sx={{ margin: "16px 0" }}
        >
          {translate(I18N_KEYS.EXPORT_HELP_CSV_TEXT)}
        </Paragraph>
        <Infobox
          sx={{
            marginBottom: "16px",
          }}
          mood="warning"
          title={translate(I18N_KEYS.HELP_WARNING_TEXT)}
        />
        <Button
          intensity="quiet"
          mood="neutral"
          type="button"
          aria-label={translate(I18N_KEYS.EXPORT_CSV_BUTTON)}
          onClick={onExportCSVData}
        >
          {translate(I18N_KEYS.EXPORT_CSV_BUTTON)}
        </Button>
      </Flex>
      {isWarningDialogOpen ? (
        <ExportWarningDialog
          isOpen={true}
          onDismiss={() => {
            setIsWarningDialogOpen(false);
          }}
          onConfirm={() => {
            exportCSVFile();
            setIsWarningDialogOpen(false);
          }}
        />
      ) : null}
    </div>
  );
};
