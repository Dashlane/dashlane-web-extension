import { Eyebrow, Heading, Paragraph } from "@dashlane/ui-components";
import { Button, Flex, Infobox } from "@dashlane/design-system";
import { useEffect, useState } from "react";
import { useHistory, useLocation } from "react-router-dom";
import useTranslate from "../../../libs/i18n/useTranslate";
import { ImportDataRoutes } from "../routes";
import { useSpaces } from "../../../libs/carbon/hooks/useSpaces";
import { DataStatus } from "@dashlane/carbon-api-consumers";
import { SpaceSelect } from "../../space-select/space-select";
import { useImportPreviewContext } from "../hooks/useImportPreviewContext";
import { carbonConnector } from "../../../libs/carbon/connector";
import { logEvent, logPageView } from "../../../libs/logs/logEvent";
import {
  BackupFileType,
  ImportDataDropAction,
  ImportDataStatus,
  ImportDataStep,
  PageView,
  UserImportDataEvent,
} from "@dashlane/hermes";
import {
  ImportLocationState,
  ImportMethod,
  ImportSourcesToLogSources,
} from "../types";
import { useNavigateAwayListener } from "../hooks/use-navigate-away-listener";
const I18N_KEYS = {
  STEP_TRACKER: "webapp_import_step_tracker_markup",
  BACK_BUTTON: "_common_action_back",
  NEXT_BUTTON: "webapp_account_import_select_button_next",
  TITLE: "webapp_account_import_space_select_title",
  SUB_TITLE: "webapp_account_import_space_select_subtitle",
  FORCED_DOMAIN_INFOBOX:
    "webapp_account_import_space_select_forced_domain_infobox",
};
export const ImportSpaceSelect = () => {
  const { translate } = useTranslate();
  const history = useHistory();
  const location = useLocation<ImportLocationState>();
  const spaces = useSpaces();
  const [isForcedDomainsEnabled, setIsForcedDomainsEnabled] = useState(false);
  const isLoading = spaces.status === DataStatus.Loading;
  const {
    importSource,
    preview: { state },
    defaultSpace,
    setDefaultSpace,
    importMethod,
  } = useImportPreviewContext();
  const totalStepCount = 3;
  const isDirectImport = importMethod === ImportMethod.DIRECT;
  useNavigateAwayListener({
    importStep: ImportDataStep.SelectDashlaneSpace,
    importSource: importSource,
    isDirectImport: isDirectImport,
    itemsToImportCount: state.attemptedItemCount,
  });
  useEffect(() => {
    if (!state.file) {
      history.push(ImportDataRoutes.ImportSource);
    }
  }, [history, state.file]);
  useEffect(() => {
    carbonConnector
      .getIsForcedDomainsEnabled()
      .then((forcedDomainsEnabled: boolean) => {
        setIsForcedDomainsEnabled(forcedDomainsEnabled);
      });
    logPageView(PageView.ImportCsvSelectSpace);
  }, []);
  const goBack = () => {
    logEvent(
      new UserImportDataEvent({
        backupFileType: BackupFileType.Csv,
        importDataStatus: ImportDataStatus.ImportFlowTerminated,
        importSource: ImportSourcesToLogSources[importSource],
        importDataDropAction: ImportDataDropAction.CancelProcess,
        importDataStep: ImportDataStep.SelectDashlaneSpace,
        itemsToImportCount: state.attemptedItemCount,
        isDirectImport: isDirectImport,
      })
    );
    history.push(ImportDataRoutes.ImportSource);
  };
  const handleDefaultSpaceChange = (spaceId: string) => {
    setDefaultSpace(spaceId);
  };
  const handleNextButtonClick = () => {
    if (location.state?.userNavigatedAway === true) {
      logEvent(
        new UserImportDataEvent({
          backupFileType: BackupFileType.Csv,
          importDataStatus: ImportDataStatus.Start,
          importSource: ImportSourcesToLogSources[importSource],
          importDataStep: ImportDataStep.SelectDashlaneSpace,
          itemsToImportCount: state.attemptedItemCount,
          isDirectImport: isDirectImport,
        })
      );
    }
    history.push(ImportDataRoutes.ImportPreview);
  };
  return (
    <Flex flexDirection="column">
      <Eyebrow size="medium" color="ds.text.neutral.quiet" sx={{ mb: "16px" }}>
        {translate.markup(I18N_KEYS.STEP_TRACKER, {
          currentStep: "2",
          totalSteps: `${totalStepCount}`,
        })}
      </Eyebrow>
      <Heading size="small" color="ds.text.neutral.catchy" sx={{ mb: "16px" }}>
        {translate(I18N_KEYS.TITLE)}
      </Heading>
      <Paragraph sx={{ mb: "16px" }} color="ds.text.neutral.quiet">
        {translate(I18N_KEYS.SUB_TITLE)}
      </Paragraph>
      <SpaceSelect
        onChange={handleDefaultSpaceChange}
        hideLabel={true}
        wrapperSx={{ display: "block" }}
      />
      <Flex gap="16px" sx={{ my: "24px" }}>
        <Button mood="neutral" intensity="quiet" type="button" onClick={goBack}>
          {translate(I18N_KEYS.BACK_BUTTON)}
        </Button>
        <Button
          mood="brand"
          intensity="catchy"
          type="button"
          onClick={handleNextButtonClick}
          disabled={isLoading || defaultSpace === null}
        >
          {translate(I18N_KEYS.NEXT_BUTTON)}
        </Button>
      </Flex>
      {isForcedDomainsEnabled ? (
        <Infobox
          size="medium"
          mood="neutral"
          title=""
          description={
            <Paragraph size="small">
              {translate(I18N_KEYS.FORCED_DOMAIN_INFOBOX)}
            </Paragraph>
          }
        />
      ) : null}
    </Flex>
  );
};
