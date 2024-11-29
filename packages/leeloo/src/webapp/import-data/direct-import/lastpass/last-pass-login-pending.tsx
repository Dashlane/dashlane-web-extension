import { useEffect } from "react";
import {
  Button,
  Flex,
  Icon,
  Infobox,
  Paragraph,
} from "@dashlane/design-system";
import {
  BackupFileType,
  HelpCenterArticleCta,
  ImportDataStep,
  PageView,
} from "@dashlane/hermes";
import { Eyebrow, Heading } from "@dashlane/ui-components";
import { ImportSource } from "@dashlane/communication";
import useTranslate from "../../../../libs/i18n/useTranslate";
import { logHelpCenterEvent, logImportStart } from "../../logs";
import { logPageView } from "../../../../libs/logs/logEvent";
import {
  useHistory,
  useRouterGlobalSettingsContext,
} from "../../../../libs/router";
import { ImportDataRoutes } from "../../routes";
import { HELPCENTER_LASTPASS_GUIDE_URL } from "../../../../app/routes/constants";
const I18N_KEYS = {
  STEP_TRACKER: "webapp_import_step_tracker_markup",
  DIRECT_IMPORT_FROM_BUTTON:
    "webapp_account_import_source_direct_import_button_markup",
  LAST_PASS_SOURCE: "webapp_account_import_source_label_lastpass",
  STEPS: {
    STEP_TITLE: "webapp_account_import_select_direct_title",
    STEP_ONE: "webapp_account_import_select_direct_step1",
    STEP_TWO: "webapp_account_import_select_direct_step2",
    STEP_THREE: "webapp_account_import_select_csv_preview_step3",
  },
  BACK_BUTTON: "_common_action_back",
  HELP_TIP_INFOBOX: "webapp_account_import_help_tip_infobox_markup",
  ERROR_INFO_TITLE: "webapp_account_import_direct_import_error_title",
  ERROR_INFO_BODY: "webapp_account_import_direct_import_error_body",
  ERROR_IMPORT_CSV_BUTTON:
    "webapp_account_import_direct_import_error_import_csv",
  ERROR_TRY_AGAIN_BUTTON: "webapp_account_import_direct_import_error_try_again",
};
interface LastPassLoginPendingProps {
  openLastPassLoginTab: () => void;
  handleBackButtonClick: () => void;
  error?: string;
}
export const LastPassLoginPending = ({
  openLastPassLoginTab,
  handleBackButtonClick,
  error,
}: LastPassLoginPendingProps) => {
  const { translate } = useTranslate();
  const { routes } = useRouterGlobalSettingsContext();
  const history = useHistory();
  useEffect(() => {
    logPageView(PageView.ImportCsvLoginToLastpass);
  }, []);
  const handleTryAgainButtonClick = () => {
    logImportStart(
      BackupFileType.Csv,
      ImportSource.Lastpass,
      ImportDataStep.DecryptLastpassVault,
      true
    );
    history.go(0);
  };
  return (
    <Flex flexDirection="column" gap={4}>
      <Eyebrow size="medium" color="ds.text.neutral.quiet">
        {translate.markup(I18N_KEYS.STEP_TRACKER, {
          currentStep: "1",
          totalSteps: "3",
        })}
      </Eyebrow>
      <Flex flexDirection="column" sx={{ maxWidth: "480px" }}>
        <Heading sx={{ marginY: "12px" }} size="x-small">
          {translate(I18N_KEYS.STEPS.STEP_TITLE, {
            source: translate(I18N_KEYS.LAST_PASS_SOURCE),
          })}
        </Heading>
        <Paragraph color="ds.text.neutral.quiet" sx={{ marginBottom: "8px" }}>
          {translate(I18N_KEYS.STEPS.STEP_ONE, {
            source: translate(I18N_KEYS.LAST_PASS_SOURCE),
          })}
        </Paragraph>
        <Paragraph color="ds.text.neutral.quiet" sx={{ marginBottom: "8px" }}>
          {translate(I18N_KEYS.STEPS.STEP_TWO, {
            source: translate(I18N_KEYS.LAST_PASS_SOURCE),
          })}
        </Paragraph>
        <Paragraph color="ds.text.neutral.quiet" sx={{ marginBottom: "8px" }}>
          {translate(I18N_KEYS.STEPS.STEP_THREE)}
        </Paragraph>
        <Infobox
          sx={{ marginY: "12px" }}
          mood="brand"
          title={translate.markup(
            I18N_KEYS.HELP_TIP_INFOBOX,
            {
              supportLink: HELPCENTER_LASTPASS_GUIDE_URL,
              source: translate(I18N_KEYS.LAST_PASS_SOURCE),
            },
            {
              linkTarget: "_blank",
              onLinkClicked: () =>
                logHelpCenterEvent(
                  HelpCenterArticleCta.LearnAboutCsvImportFormatting
                ),
            }
          )}
        />
        {error ? (
          <Infobox
            mood="danger"
            size="large"
            actions={[
              <Button
                key="import"
                intensity="quiet"
                mood="danger"
                size="small"
                onClick={() =>
                  history.push(
                    `${routes.importData}/${ImportDataRoutes.ImportSource}`
                  )
                }
              >
                {translate(I18N_KEYS.ERROR_IMPORT_CSV_BUTTON)}
              </Button>,
              <Button
                key="tryAgain"
                intensity="catchy"
                mood="danger"
                size="small"
                onClick={handleTryAgainButtonClick}
              >
                {translate(I18N_KEYS.ERROR_TRY_AGAIN_BUTTON)}
              </Button>,
            ]}
            title={translate(I18N_KEYS.ERROR_INFO_TITLE)}
            description={translate(I18N_KEYS.ERROR_INFO_BODY)}
          />
        ) : null}
      </Flex>
      <Flex gap={6}>
        <Button
          onClick={handleBackButtonClick}
          mood="neutral"
          intensity="quiet"
        >
          {translate(I18N_KEYS.BACK_BUTTON)}
        </Button>
        <Button
          type="button"
          mood={"brand"}
          intensity={"catchy"}
          onClick={openLastPassLoginTab}
          layout={"iconTrailing"}
          icon={<Icon name="ActionOpenExternalLinkOutlined" />}
        >
          {translate.markup(I18N_KEYS.DIRECT_IMPORT_FROM_BUTTON, {
            source: translate(I18N_KEYS.LAST_PASS_SOURCE),
          })}
        </Button>
      </Flex>
    </Flex>
  );
};
