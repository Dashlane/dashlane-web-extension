import { useState } from "react";
import { browser } from "@dashlane/browser-utils";
import { BackupFileType, UserExportDataEvent } from "@dashlane/hermes";
import {
  Button,
  Flex,
  Heading,
  Infobox,
  Paragraph,
  useToast,
} from "@dashlane/design-system";
import useTranslate from "../../../../libs/i18n/useTranslate";
import { carbonConnector } from "../../../../libs/carbon/connector";
import { logEvent } from "../../../../libs/logs/logEvent";
import { downloadFile } from "../../../../libs/file-download/file-download";
import { useProtectedItemsUnlocker } from "../../../unlock-items";
import { LockedItemType, UnlockerAction } from "../../../unlock-items/types";
import { ExportWarningDialog } from "../export-dialogs/export-warning/export-warning-dialog";
import { CreateUniquePasswordDialog } from "../export-dialogs/create-unique-password/create-unique-password-dialog";
const I18N_KEYS = {
  SUB_TITLE_DASH_EXPORT: "webapp_account_import_export_data_sub_title_export",
  EXPORT_HELP_DASH_TEXT:
    "webapp_account_import_export_data_help_text_secure_export",
  EXPORT_DASH_BUTTON: "webapp_account_import_export_data_secure_export_button",
  EXPORT_SUCCESS_MESSAGE:
    "webapp_account_import_export_data_secure_success_message",
  EXPORT_DASH_SAFARI_UNSUPPORTED:
    "webapp_account_import_export_data_secure_export_safari_unsupported",
};
export interface ConfirmNewPassword {
  password: string;
}
export interface Props {
  reportError: (error: Error) => void;
}
export const ExportDashData = ({ reportError }: Props) => {
  const { translate } = useTranslate();
  const { areProtectedItemsUnlocked, openProtectedItemsUnlocker } =
    useProtectedItemsUnlocker();
  const { showToast } = useToast();
  const [isWarningDialogOpen, setIsWarningDialogOpen] = useState(false);
  const [isCreateUniqueMpDialogOpen, setIsCreateUniqueMpDialogOpen] =
    useState(false);
  const exportDashFile = async (password: string) => {
    const result = await carbonConnector.getPersonalDataExport({
      exportType: "secure-dashlane",
      password,
    });
    if (!result.success) {
      reportError(new Error(`Cannot export DASH file : ${result.error.code}`));
      return;
    }
    downloadFile(
      result.response.content,
      result.response.filename,
      "text/dash"
    );
    setIsCreateUniqueMpDialogOpen(false);
    showToast({ description: translate(I18N_KEYS.EXPORT_SUCCESS_MESSAGE) });
    logEvent(
      new UserExportDataEvent({
        backupFileType: BackupFileType.SecureVault,
      })
    );
  };
  const exportDataAsFile = async () => {
    const isForceDomainsEnabled =
      await carbonConnector.getIsForcedDomainsEnabled();
    if (!isForceDomainsEnabled) {
      setIsCreateUniqueMpDialogOpen(true);
      return;
    }
    setIsWarningDialogOpen(true);
  };
  const onExportDashData = () => {
    if (!areProtectedItemsUnlocked) {
      openProtectedItemsUnlocker({
        action: UnlockerAction.Export,
        itemType: LockedItemType.ExportData,
        options: {
          fieldsKeys: { confirm: "webapp_lock_items_export" },
          translated: false,
        },
        successCallback: () => exportDataAsFile(),
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
          sx={{
            marginTop: "16px",
          }}
        >
          {translate(I18N_KEYS.SUB_TITLE_DASH_EXPORT)}
        </Heading>

        <Paragraph
          color="ds.text.neutral.standard"
          sx={{ margin: "16px 0" }}
          textStyle="ds.body.standard.regular"
        >
          {translate(I18N_KEYS.EXPORT_HELP_DASH_TEXT)}
        </Paragraph>

        {browser.isSafari() ? (
          <Infobox
            title={translate(I18N_KEYS.EXPORT_DASH_SAFARI_UNSUPPORTED)}
          />
        ) : (
          <Button
            intensity="quiet"
            mood="neutral"
            type="button"
            aria-label={translate(I18N_KEYS.EXPORT_DASH_BUTTON)}
            onClick={onExportDashData}
          >
            {translate(I18N_KEYS.EXPORT_DASH_BUTTON)}
          </Button>
        )}
      </Flex>
      {isWarningDialogOpen ? (
        <ExportWarningDialog
          isOpen={true}
          onDismiss={() => {
            setIsWarningDialogOpen(false);
          }}
          onConfirm={() => {
            setIsWarningDialogOpen(false);
            setIsCreateUniqueMpDialogOpen(true);
          }}
        />
      ) : null}
      {isCreateUniqueMpDialogOpen ? (
        <CreateUniquePasswordDialog
          isOpen={true}
          onConfirm={exportDashFile}
          onDismiss={() => {
            setIsCreateUniqueMpDialogOpen(false);
          }}
        />
      ) : null}
    </div>
  );
};
