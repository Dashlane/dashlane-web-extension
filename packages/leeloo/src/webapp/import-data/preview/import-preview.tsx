import { useCallback, useEffect, useState } from "react";
import {
  AlertSeverity,
  Eyebrow,
  Heading,
  Link,
  Paragraph,
} from "@dashlane/ui-components";
import { Button, Flex } from "@dashlane/design-system";
import { DataStatus } from "@dashlane/carbon-api-consumers";
import { useHistory } from "../../../libs/router";
import { ImportDataRoutes } from "../routes";
import { useImportPreviewContext } from "../hooks/useImportPreviewContext";
import { ImportPreviewTable } from "./import-preview-table";
import useTranslate from "../../../libs/i18n/useTranslate";
import { CatchUnsavedChanges } from "../../../libs/dashlane-style/catch-unsaved-changes/CatchUnsavedChanges";
import {
  BackupFileType,
  HelpCenterArticleCta,
  ImportDataStep as HermesImportDataStep,
  ImportDataDropAction,
  ImportDataStatus,
  PageView,
  UserImportDataEvent,
} from "@dashlane/hermes";
import { logEvent, logPageView } from "../../../libs/logs/logEvent";
import {
  logHelpCenterEvent,
  logImportFailure,
  logImportFlowTerminated,
} from "../logs";
import {
  BaseDataModelObject,
  DataModelType,
  ImportSource,
  PremiumStatusSpace,
} from "@dashlane/communication";
import { ImportDataStep } from "../hooks/types";
import { useAlert } from "../../../libs/alert-notifications/use-alert";
import { ImportDataDialogLoading } from "../dialogs/import-data-dialog-loading";
import { useSpaces } from "../../../libs/carbon/hooks/useSpaces";
import { IMPORT_GUIDE } from "../import/import-source";
import {
  ImportLocationState,
  ImportMethod,
  ImportSourcesToLogSources,
} from "../types";
import { useNavigateAwayListener } from "../hooks/use-navigate-away-listener";
import { useIsPersonalSpaceDisabled } from "../../../libs/hooks/use-is-personal-space-disabled";
const I18N_KEYS = {
  STEP_TRACKER: "webapp_import_step_tracker_markup",
  TITLE: "webapp_import_preview_title",
  SUBTITLE: "webapp_import_preview_subtitle",
  LABELS_TIP: "webapp_import_preview_tip_labels_markup",
  DO_NOT_IMPORT_TIP: "webapp_import_preview_tip_do_not_import_markup",
  IMPORT_BUTTON: "webapp_import_preview_import_button_markup",
  BACK_BUTTON: "_common_action_back",
  TROUBLESHOOT_LINK: "webapp_import_preview_import_troubleshoot_link",
  GENERIC_ERROR: "team_feedback_notification_error_generic",
  UNSAVED_CHANGES_TITLE: "webapp_import_unsaved_changes_title",
  UNSAVED_CHANGES_BODY: "webapp_import_unsaved_changes_body",
};
export const ImportPreview = () => {
  const {
    preview: { state, setAttemptedCount },
    import: { startImport, state: importDataState },
    importSource,
    previewDataItems,
    setPreviewDataItems,
    previewDataHeaders,
    importMethod,
  } = useImportPreviewContext();
  const isDirectImport = importMethod === ImportMethod.DIRECT;
  const history = useHistory<ImportLocationState>();
  const alert = useAlert();
  const { translate } = useTranslate();
  const spaces = useSpaces();
  const isPersonalSpaceDisabled = useIsPersonalSpaceDisabled();
  const [spaceList, setSpaceList] = useState<PremiumStatusSpace[]>([]);
  const [importStarted, setImportStarted] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const isPersonalSpaceEnabled =
    isPersonalSpaceDisabled.status === DataStatus.Success &&
    !isPersonalSpaceDisabled.isDisabled;
  const hasMultipleSpaces = spaceList.length > 0 && isPersonalSpaceEnabled;
  const totalAndCurrentStep =
    hasMultipleSpaces || (isDirectImport && isPersonalSpaceEnabled) ? 3 : 2;
  useNavigateAwayListener({
    importStep: HermesImportDataStep.PreviewItemsToImport,
    importSource: importSource,
    isDirectImport: isDirectImport,
    itemsToImportCount: state.attemptedItemCount,
  });
  useEffect(() => {
    if (spaces.status === DataStatus.Success) {
      setSpaceList(spaces.data);
    }
  }, [spaces]);
  useEffect(() => {
    if (!state.file) {
      history.push(ImportDataRoutes.ImportSource);
    }
  }, [history, state.file]);
  const showErrorAlert = useCallback(() => {
    alert.showAlert(translate(I18N_KEYS.GENERIC_ERROR), AlertSeverity.ERROR);
  }, [alert, translate]);
  useEffect(() => {
    logPageView(PageView.ImportCsvPreviewDataUpload);
  }, []);
  const filteredImportCount = Object.values(previewDataItems).filter(
    (item) =>
      item.baseDataModel.kwType &&
      item.baseDataModel.kwType !== DataModelType.KWCollection
  ).length;
  useEffect(() => {
    setAttemptedCount(filteredImportCount);
  }, [filteredImportCount, setAttemptedCount]);
  useEffect(() => {
    switch (importDataState.status) {
      case ImportDataStep.ERROR_GENERIC: {
        logImportFailure(
          BackupFileType.Csv,
          importSource,
          state.attemptedItemCount,
          isDirectImport
        );
        showErrorAlert();
        return;
      }
      case ImportDataStep.SUCCESS: {
        history.push(ImportDataRoutes.ImportSummary);
        return;
      }
    }
  }, [
    history,
    importDataState.status,
    importSource,
    showErrorAlert,
    state.attemptedItemCount,
  ]);
  const handleBackButtonClick = () => {
    logEvent(
      new UserImportDataEvent({
        backupFileType: BackupFileType.Csv,
        importDataStatus: ImportDataStatus.ImportFlowTerminated,
        importSource: ImportSourcesToLogSources[importSource],
        importDataDropAction: ImportDataDropAction.CancelProcess,
        importDataStep: HermesImportDataStep.PreviewItemsToImport,
        itemsToImportCount: state.attemptedItemCount,
        isDirectImport: isDirectImport,
      })
    );
    history.push({
      pathname: hasMultipleSpaces
        ? ImportDataRoutes.ImportSpaceSelect
        : ImportDataRoutes.ImportSource,
      state: { userNavigatedAway: true },
    });
  };
  const handleImportClick = async () => {
    setImportStarted(true);
    try {
      if (state.format) {
        const backupFileType =
          importSource === ImportSource.Dash
            ? BackupFileType.SecureVault
            : BackupFileType.Csv;
        const importResult = await startImport(
          {
            format: state.format,
            name: state.fileName,
            content: Object.keys(previewDataItems)
              .map((key) => previewDataItems[key].baseDataModel)
              .filter(
                (item): item is BaseDataModelObject => item.kwType !== undefined
              ),
          },
          importSource,
          backupFileType,
          importMethod
        );
        if (!importResult.success) {
          showErrorAlert();
        }
      }
    } finally {
      setImportStarted(false);
    }
  };
  return (
    <Flex flexDirection="column" gap="10px">
      {importStarted || importDataState.status === ImportDataStep.PROCESSING ? (
        <ImportDataDialogLoading showCloseIcon={false} isOpen={true} />
      ) : null}
      <CatchUnsavedChanges
        titleText={translate(I18N_KEYS.UNSAVED_CHANGES_TITLE)}
        bodyText={translate(I18N_KEYS.UNSAVED_CHANGES_BODY)}
        onUnsavedChangesCaught={() => logPageView(PageView.ImportLeaveProcess)}
        onLeavePage={() =>
          logImportFlowTerminated(
            importSource,
            Object.keys(previewDataItems).length,
            isDirectImport
          )
        }
        dirty={
          !!state.fileName &&
          importDataState.status !== ImportDataStep.SUCCESS &&
          hasChanges
        }
      />
      <Eyebrow>
        {translate.markup(I18N_KEYS.STEP_TRACKER, {
          currentStep: `${totalAndCurrentStep}`,
          totalSteps: `${totalAndCurrentStep}`,
        })}
      </Eyebrow>
      <Heading size="small">{translate(I18N_KEYS.TITLE)}</Heading>
      <Paragraph>{translate(I18N_KEYS.SUBTITLE)}</Paragraph>

      <ul
        sx={{
          marginLeft: "24px",
          listStyle: "disc",
        }}
      >
        <li>{translate.markup(I18N_KEYS.LABELS_TIP)}</li>
        <li>{translate.markup(I18N_KEYS.DO_NOT_IMPORT_TIP)}</li>
      </ul>

      {Object.keys(previewDataItems).length ? (
        <ImportPreviewTable
          setHasChanges={setHasChanges}
          tableData={previewDataItems}
          setTableData={setPreviewDataItems}
          tableHeaders={previewDataHeaders}
        />
      ) : null}

      <Flex gap="16px">
        <Button
          onClick={handleBackButtonClick}
          type="button"
          mood="neutral"
          intensity="quiet"
        >
          {translate(I18N_KEYS.BACK_BUTTON)}
        </Button>
        <Button
          mood="brand"
          intensity="catchy"
          disabled={!filteredImportCount}
          type="button"
          onClick={handleImportClick}
        >
          {translate.markup(I18N_KEYS.IMPORT_BUTTON, {
            itemCount: filteredImportCount,
          })}
        </Button>

        <div sx={{ flex: 1 }} />
        <Link
          sx={{ alignSelf: "center" }}
          color="ds.text.brand.standard"
          href={IMPORT_GUIDE[importSource]}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() =>
            logHelpCenterEvent(HelpCenterArticleCta.TroubleshootImportingIssues)
          }
        >
          {translate(I18N_KEYS.TROUBLESHOOT_LINK)}
        </Link>
      </Flex>
    </Flex>
  );
};
