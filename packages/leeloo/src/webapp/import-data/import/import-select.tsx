import { ReactNode, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { ImportSource, PremiumStatusSpace } from "@dashlane/communication";
import { DataStatus } from "@dashlane/framework-react";
import { Button, Card, Flex, Heading, Infobox } from "@dashlane/design-system";
import {
  BackupFileType,
  ImportDataDropAction,
  ImportDataStatus,
  ImportDataStep,
  PageView,
  UserImportDataEvent,
} from "@dashlane/hermes";
import { logEvent, logPageView } from "../../../libs/logs/logEvent";
import useTranslate from "../../../libs/i18n/useTranslate";
import { useSpaces } from "../../../libs/carbon/hooks/useSpaces";
import { useIsPersonalSpaceDisabled } from "../../../libs/hooks/use-is-personal-space-disabled";
import { ImportDragNDrop } from "../components/import-drag-n-drop";
import { ImportDataRoutes } from "../routes";
import { ImportSourcesToLogSources } from "../types";
import { useImportPreviewContext } from "../hooks/useImportPreviewContext";
import { useNavigateAwayListener } from "../hooks/use-navigate-away-listener";
import { IMPORT_GUIDE } from "./import-source";
const I18N_KEYS = {
  HEADER_CSV: "webapp_account_import_select_header_csv",
  HEADER_DASH: "webapp_account_import_select_header_dash",
  STEP_TRACKER: "webapp_import_step_tracker_markup",
  BACK_BUTTON: "_common_action_back",
  NEXT_BUTTON: "webapp_account_import_select_button_next",
  FILE_IDLE: "webapp_account_import_select_idle_markup",
  DASH_READY: "webapp_account_import_select_ready_dash",
  CSV_READY: "webapp_account_import_select_ready_csv",
  HEADER_ERROR_MASSAGE: "webapp_import_chrome_on_import_error_message_markup",
  ERROR_HELP_CENTER_TITLE: "webapp_account_import_select_error_info_intro",
};
const I18N_KEYS_IMPORT_SOURCE = {
  "1password": "webapp_account_import_select_1password_help_markup",
  bitwarden: "webapp_account_import_select_bitwarden_help_markup",
  chrome: "webapp_account_import_select_chrome_help_markup",
  dash: "webapp_account_import_select_dash_help_markup",
  edge: "webapp_account_import_select_edge_help_markup",
  firefox: "webapp_account_import_select_firefox_help_markup",
  keepass: "webapp_account_import_select_keepass_help_markup",
  keeper: "webapp_account_import_select_keeper_help_markup",
  lastpass: "webapp_account_import_select_lastpass_help_markup",
  other: "webapp_account_import_select_other_help_markup",
  safari: "webapp_account_import_select_safari_help_markup",
};
export const I18N_KEYS_ERROR_TIP = {
  "1password": "webapp_account_import_select_1password_error_info_markup",
  bitwarden: "webapp_account_import_select_bitwarden_error_info_markup",
  chrome: "webapp_account_import_select_chrome_error_info_markup",
  dash: "webapp_account_import_select_dash_error_info_markup",
  edge: "webapp_account_import_select_edge_error_info_markup",
  firefox: "webapp_account_import_select_firefox_error_info_markup",
  keepass: "webapp_account_import_select_keepass_error_info_markup",
  keeper: "webapp_account_import_select_keeper_error_info_markup",
  lastpass: "webapp_account_import_select_lastpass_error_info_markup",
  other: "webapp_account_import_select_other_error_info_markup",
  safari: "webapp_account_import_select_safari_error_info_markup",
};
export const ImportSelect = () => {
  const [errorMessage, setErrorMessage] = useState<ReactNode>("");
  const [displayFormatInfo, setDisplayFormatInfo] = useState(false);
  const [isFileInvalid, setIsFileInvalid] = useState(false);
  const { translate } = useTranslate();
  const history = useHistory();
  const spaces = useSpaces();
  const isPersonalSpaceDisabled = useIsPersonalSpaceDisabled();
  const [spaceList, setSpaceList] = useState<PremiumStatusSpace[]>([]);
  const isLoading = spaces.status === DataStatus.Loading;
  const isPersonalSpaceEnabled =
    isPersonalSpaceDisabled.status === DataStatus.Success &&
    !isPersonalSpaceDisabled.isDisabled;
  const hasMultipleSpaces = spaceList.length > 0 && isPersonalSpaceEnabled;
  const totalSteps = hasMultipleSpaces ? 3 : 2;
  useEffect(() => {
    if (spaces.status === DataStatus.Success) {
      setSpaceList(spaces.data);
    }
  }, [spaces]);
  const {
    preview: { processFile, state, resetState, previewFile },
    importSource,
    setPreviewDataItems,
    setPreviewDataHeaders,
  } = useImportPreviewContext();
  useEffect(() => {
    resetState();
  }, []);
  useEffect(() => {
    const pageViewEvent =
      importSource === ImportSource.Dash
        ? PageView.ImportDash
        : PageView.ImportCsv;
    logPageView(pageViewEvent);
  }, [importSource]);
  const isCSV = importSource !== ImportSource.Dash;
  const fileAccept = isCSV ? [".csv"] : [".dash"];
  const importIdleMessage = translate.markup(I18N_KEYS.FILE_IDLE, {
    fileExtension: isCSV ? "CSV" : "DASH",
  });
  const importReadyMessage = translate(
    isCSV ? I18N_KEYS.CSV_READY : I18N_KEYS.DASH_READY
  );
  useNavigateAwayListener({
    importStep: ImportDataStep.SelectFile,
    importSource: importSource,
    isDirectImport: false,
    itemsToImportCount: state.attemptedItemCount,
  });
  const handlePreviewFile = () => {
    if (isCSV) {
      previewFile(importSource).then((previewData) => {
        if (previewData.success && previewData.data.items.length) {
          const previewDataMap = {};
          previewData.data.items.forEach((item) => {
            previewDataMap[item.baseDataModel.Id] = item;
          });
          setPreviewDataItems(previewDataMap);
          setPreviewDataHeaders(previewData.data.headers);
          const nextStepRoute = hasMultipleSpaces
            ? ImportDataRoutes.ImportSpaceSelect
            : ImportDataRoutes.ImportPreview;
          history.push(nextStepRoute);
        } else {
          setErrorMessage(translate.markup(I18N_KEYS.HEADER_ERROR_MASSAGE));
          logEvent(
            new UserImportDataEvent({
              backupFileType: isCSV
                ? BackupFileType.Csv
                : BackupFileType.SecureVault,
              importDataStatus:
                previewData.success && !previewData.data.items.length
                  ? ImportDataStatus.NoDataFound
                  : ImportDataStatus.WrongFileStructure,
              importSource: ImportSourcesToLogSources[importSource],
              importDataStep: ImportDataStep.SelectFile,
              isDirectImport: false,
              itemsToImportCount: previewData.success
                ? previewData.data.items.length
                : undefined,
            })
          );
          setDisplayFormatInfo(true);
        }
      });
    } else {
      history.push(ImportDataRoutes.SecureImport);
    }
  };
  const handleFileDropped = (file: File) => {
    if (errorMessage) {
      logEvent(
        new UserImportDataEvent({
          backupFileType: isCSV
            ? BackupFileType.Csv
            : BackupFileType.SecureVault,
          importDataStatus: ImportDataStatus.Start,
          importSource: ImportSourcesToLogSources[importSource],
          importDataStep: ImportDataStep.SelectFile,
          isDirectImport: false,
        })
      );
    }
    processFile(file);
  };
  const goBack = () => {
    logEvent(
      new UserImportDataEvent({
        backupFileType: isCSV ? BackupFileType.Csv : BackupFileType.SecureVault,
        importDataStatus: ImportDataStatus.ImportFlowTerminated,
        importSource: ImportSourcesToLogSources[importSource],
        importDataDropAction: ImportDataDropAction.CancelProcess,
        importDataStep: ImportDataStep.SelectFile,
        isDirectImport: false,
      })
    );
    history.push(ImportDataRoutes.ImportSource);
  };
  if (isPersonalSpaceDisabled.status !== DataStatus.Success) {
    return null;
  }
  return (
    <Card sx={{ width: "720px" }}>
      <Heading
        as="h1"
        textStyle="ds.title.supporting.small"
        color="ds.text.neutral.quiet"
      >
        {translate.markup(I18N_KEYS.STEP_TRACKER, {
          currentStep: "1",
          totalSteps: `${totalSteps}`,
        })}
      </Heading>
      <Heading
        as="h2"
        textStyle="ds.title.section.medium"
        color="ds.text.neutral.catchy"
      >
        {isCSV
          ? translate(I18N_KEYS.HEADER_CSV)
          : translate(I18N_KEYS.HEADER_DASH)}
      </Heading>
      <ImportDragNDrop
        onFileDropped={handleFileDropped}
        undoFileDropped={resetState}
        setErrorMessage={setErrorMessage}
        error={errorMessage}
        accept={fileAccept}
        idleMessage={importIdleMessage}
        fileSelectedMessage={importReadyMessage}
        setFileInvalid={setIsFileInvalid}
        importSource={importSource}
      />
      {isFileInvalid ? (
        <div sx={{ marginTop: "24px" }}>
          <Infobox
            mood="brand"
            title={
              <>
                {translate(I18N_KEYS.ERROR_HELP_CENTER_TITLE)}
                <br />
                {translate.markup(
                  I18N_KEYS_ERROR_TIP[importSource],
                  {
                    supportLink: IMPORT_GUIDE[importSource],
                  },
                  {
                    linkTarget: "_blank",
                  }
                )}
              </>
            }
          />
        </div>
      ) : displayFormatInfo ? (
        <div sx={{ marginTop: "24px" }}>
          <Infobox
            mood="danger"
            title={translate.markup(
              I18N_KEYS_IMPORT_SOURCE[importSource],
              {
                supportLink: IMPORT_GUIDE[importSource],
              },
              {
                linkTarget: "_blank",
              }
            )}
          />
        </div>
      ) : null}
      <Flex flexDirection="row" gap="16px" justifyContent="right">
        <Button type="button" mood="neutral" intensity="quiet" onClick={goBack}>
          {translate(I18N_KEYS.BACK_BUTTON)}
        </Button>
        <Button
          mood="brand"
          intensity="catchy"
          type="button"
          onClick={handlePreviewFile}
          disabled={!state.file || !!errorMessage || isLoading}
        >
          {translate(I18N_KEYS.NEXT_BUTTON)}
        </Button>
      </Flex>
    </Card>
  );
};
