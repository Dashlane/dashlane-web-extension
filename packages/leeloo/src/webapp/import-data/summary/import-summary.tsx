import { useEffect } from "react";
import { ImportFormats } from "@dashlane/communication";
import { Button, Heading, Infobox, Paragraph } from "@dashlane/design-system";
import { LoadingIcon } from "@dashlane/ui-components";
import useTranslate from "../../../libs/i18n/useTranslate";
import { ImportDataStep } from "../hooks/types";
import { BackupFileType, PageView, Space } from "@dashlane/hermes";
import { logPageView } from "../../../libs/logs/logEvent";
import { logImportSuccess } from "../logs";
import { useImportPreviewContext } from "../hooks/useImportPreviewContext";
import { I18N_KEYS_ERROR_TIP } from "../import/import-select";
import { IMPORT_GUIDE } from "../import/import-source";
import { ImportMethod } from "../types";
import { useHistory } from "react-router-dom";
import { useRouterGlobalSettingsContext } from "../../../libs/router";
export const I18N_KEYS = {
  TITLE: "webapp_import_summary_title",
  IMPORT_MESSAGE: "webapp_import_summary_text",
  SHORT_TIP_CSV: "webapp_import_summary_short_tip_csv",
  SHORT_TIP_DASH: "webapp_import_summary_short_tip_dash",
  ERROR_HELP_CENTER_TITLE: "webapp_account_import_select_error_info_intro",
  ERROR_TITLE: "_common_generic_error",
  DUPLICATE_DESCRIPTION: "webapp_import_summary_duplicates_markup",
  OPEN_LOGINS_BUTTON: "webapp_import_summary_open_logins_button",
};
export const ImportSummary = () => {
  const { translate } = useTranslate();
  const history = useHistory();
  const globalRouterContext = useRouterGlobalSettingsContext();
  const {
    preview: {
      state: { format },
    },
    import: { state },
    importSource,
    defaultSpace,
    importMethod,
  } = useImportPreviewContext();
  const isDirectImport = importMethod === ImportMethod.DIRECT;
  useEffect(() => {
    const pageViewEvent =
      format === ImportFormats.Csv
        ? PageView.ImportCsvSuccess
        : PageView.ImportDashSuccess;
    logPageView(pageViewEvent);
  }, []);
  useEffect(() => {
    if (format === null || state.status !== ImportDataStep.SUCCESS) {
      return;
    }
    const backupFileType =
      format === ImportFormats.Csv
        ? BackupFileType.Csv
        : BackupFileType.SecureVault;
    if (
      state.totalCredentials ||
      backupFileType === BackupFileType.SecureVault
    ) {
      logImportSuccess(
        backupFileType,
        importSource,
        state.importedCredentials,
        state.totalCredentials,
        defaultSpace === "" || defaultSpace === null
          ? Space.Personal
          : Space.Professional,
        isDirectImport
      );
    }
  }, [format, importSource, defaultSpace, state]);
  return (
    <div
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: "24px",
      }}
    >
      {state.status === ImportDataStep.SUCCESS ? (
        <>
          <Heading as="h5" textStyle="ds.title.section.medium">
            {translate(I18N_KEYS.TITLE, {
              itemCount: state.importedCredentials,
            })}
          </Heading>
          {state.duplicateCredentials ? (
            <Paragraph color="ds.text.neutral.quiet">
              {translate.markup(I18N_KEYS.DUPLICATE_DESCRIPTION, {
                count: state.duplicateCredentials,
              })}
            </Paragraph>
          ) : null}
          <Paragraph color="ds.text.neutral.quiet">
            {format === ImportFormats.Csv ? (
              <>
                {translate(I18N_KEYS.IMPORT_MESSAGE)}
                <br />
                <br />
                {!isDirectImport ? translate(I18N_KEYS.SHORT_TIP_CSV) : null}
              </>
            ) : (
              translate(I18N_KEYS.SHORT_TIP_DASH)
            )}
          </Paragraph>
        </>
      ) : state.status === ImportDataStep.ERROR_GENERIC ? (
        <Heading
          as="h5"
          textStyle="ds.title.section.medium"
          sx={{ marginBottom: "24px" }}
        >
          {translate(I18N_KEYS.ERROR_TITLE)}
        </Heading>
      ) : (
        <LoadingIcon />
      )}
      <Infobox
        mood="brand"
        title={
          <>
            <span>{translate(I18N_KEYS.ERROR_HELP_CENTER_TITLE)}</span>
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
      <Button
        mood="brand"
        intensity="catchy"
        onClick={() => history.push(globalRouterContext.routes.userCredentials)}
      >
        {translate(I18N_KEYS.OPEN_LOGINS_BUTTON)}
      </Button>
    </div>
  );
};
