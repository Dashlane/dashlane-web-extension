import { ChangeEvent, SyntheticEvent } from "react";
import {
  Eyebrow,
  Heading,
  Paragraph,
  PasswordInput,
  TextInput,
} from "@dashlane/ui-components";
import { BackupFileType, ImportDataStep } from "@dashlane/hermes";
import { Button, Flex, Infobox } from "@dashlane/design-system";
import useTranslate from "../../../../libs/i18n/useTranslate";
import {
  useHistory,
  useRouterGlobalSettingsContext,
} from "../../../../libs/router";
import { ImportDataRoutes } from "../../routes";
import { logImportStart } from "../../logs";
import { useImportPreviewContext } from "../../hooks/useImportPreviewContext";
const I18N_KEYS = {
  HEADER: "webapp_account_import_direct_import_lastpass_header",
  STEP_TRACKER: "webapp_import_step_tracker_markup",
  IMPORT_TIP: "webapp_account_import_direct_import_lastpass_import_tip",
  EMAIL_LABEL: "webapp_import_preview_header_login",
  PASSWORD_LABEL: "webapp_import_preview_header_password",
  UNLOCK_BUTTON: "webapp_account_import_direct_import_lastpass_preview_button",
  LOGIN_PLACEHOLDER:
    "webapp_account_import_direct_import_lastpass_login_placeholder",
  PASSWORD_PLACEHOLDER:
    "webapp_account_import_direct_import_lastpass_password_placeholder",
  TOOLTIP_SHOW_LABEL: "_common_password_show_label",
  TOOLTIP_HIDE_LABEL: "_common_password_hide_label",
  ERROR_TRY_AGAIN_BUTTON: "webapp_account_import_direct_import_error_try_again",
  BACK_BUTTON: "_common_action_back",
  ERROR_INFO_TITLE: "webapp_account_import_direct_import_error_title",
  ERROR_INFO_BODY: "webapp_account_import_direct_import_error_body",
  ERROR_IMPORT_CSV_BUTTON:
    "webapp_account_import_direct_import_error_import_csv",
};
interface UnlockLastPassVaultProps {
  error: string;
  processLastPassData: (e: SyntheticEvent) => Promise<void>;
  login: string;
  password: string;
  handlePasswordInputChange: (e: ChangeEvent<HTMLInputElement>) => void;
  handleLoginInputChange: (e: ChangeEvent<HTMLInputElement>) => void;
  handleBackButtonClick: () => void;
}
export const UnlockLastPassVault = ({
  error,
  processLastPassData,
  login,
  password,
  handlePasswordInputChange,
  handleLoginInputChange,
  handleBackButtonClick,
}: UnlockLastPassVaultProps) => {
  const history = useHistory();
  const { translate } = useTranslate();
  const { routes } = useRouterGlobalSettingsContext();
  const { importSource } = useImportPreviewContext();
  const handleTryAgainButtonClick = () => {
    logImportStart(
      BackupFileType.Csv,
      importSource,
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
          totalSteps: `3`,
        })}
      </Eyebrow>

      <Heading size="small">{translate(I18N_KEYS.HEADER)}</Heading>
      <Flex
        flexDirection="column"
        gap={4}
        as="form"
        onSubmit={processLastPassData}
      >
        <Paragraph>{translate(I18N_KEYS.IMPORT_TIP)}</Paragraph>
        <TextInput
          fullWidth
          value={login}
          label={translate(I18N_KEYS.EMAIL_LABEL)}
          placeholder={translate(I18N_KEYS.LOGIN_PLACEHOLDER)}
          onChange={handleLoginInputChange}
        />
        <PasswordInput
          fullWidth
          value={password}
          label={translate(I18N_KEYS.PASSWORD_LABEL)}
          placeholder={translate(I18N_KEYS.PASSWORD_PLACEHOLDER)}
          onChange={handlePasswordInputChange}
          hidePasswordTooltipText={translate(I18N_KEYS.TOOLTIP_HIDE_LABEL)}
          showPasswordTooltipText={translate(I18N_KEYS.TOOLTIP_SHOW_LABEL)}
        />
        {error ? (
          <Infobox
            mood="danger"
            size="large"
            actions={[
              <Button
                size="small"
                key="import"
                intensity="quiet"
                mood="danger"
                onClick={() =>
                  history.push(
                    `${routes.importData}/${ImportDataRoutes.ImportSource}`
                  )
                }
              >
                {translate(I18N_KEYS.ERROR_IMPORT_CSV_BUTTON)}
              </Button>,
              <Button
                size="small"
                key="try-again"
                intensity="catchy"
                mood="danger"
                onClick={handleTryAgainButtonClick}
              >
                {translate(I18N_KEYS.ERROR_TRY_AGAIN_BUTTON)}
              </Button>,
            ]}
            title={translate(I18N_KEYS.ERROR_INFO_TITLE)}
            description={translate(I18N_KEYS.ERROR_INFO_BODY)}
          />
        ) : null}
        <Flex gap={4}>
          <Button
            onClick={handleBackButtonClick}
            mood="neutral"
            intensity="quiet"
          >
            {translate(I18N_KEYS.BACK_BUTTON)}
          </Button>
          <Button disabled={!password || !login} type="submit">
            {translate(I18N_KEYS.UNLOCK_BUTTON)}
          </Button>
        </Flex>
      </Flex>
    </Flex>
  );
};
