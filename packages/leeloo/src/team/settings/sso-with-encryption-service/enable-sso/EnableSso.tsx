import { useState } from "react";
import { Toggle } from "@dashlane/design-system";
import {
  AlertSeverity,
  colors,
  GridChild,
  GridContainer,
  Paragraph,
} from "@dashlane/ui-components";
import { TeamSettings } from "@dashlane/communication";
import { SsoSetupStep } from "@dashlane/hermes";
import useTranslate from "../../../../libs/i18n/useTranslate";
import { DisableSsoDialog } from "./DisableSsoDialog";
import { DialogAction } from "../../sso/types";
import { useAlert } from "../../../../libs/alert-notifications/use-alert";
import { ConfirmDialog } from "../../confirm-dialog";
import { logSelfHostedSSOSetupStep } from "../../sso-setup-logs";
import { useTeamSpaceContext } from "../../components/TeamSpaceContext";
const { grey00 } = colors;
export type EnableSsoProps = {
  actionsDisabled: boolean;
  ssoEnabled: boolean;
  loading: boolean;
  updateTeamSettings: (settings: TeamSettings) => Promise<void>;
};
const I18N_KEYS = {
  ACTION_TITLE: "team_settings_enable_sso_action_title",
  ACTION_DESCRIPTION: "team_settings_enable_sso_action_description",
  ACTION_DESCRIPTION_NOTE: "team_settings_enable_sso_action_description_note",
  TOGGLE_WARNING: "team_settings_enable_sso_action_toggle_warning_markup",
  GENERIC_ERROR: "_common_generic_error",
  CONFIRM_DIALOG_TITLE: "team_settings_enable_sso_confirm_dialog_title",
  CONFIRM_DIALOG_BODY: "team_settings_enable_sso_confirm_dialog_body",
  CONFIRM_DIALOG_PRIMARY_ACTION_LABEL:
    "team_settings_enable_sso_confirm_dialog_primary_action_label",
};
export const EnableSso = ({
  actionsDisabled,
  ssoEnabled,
  updateTeamSettings,
  loading,
}: EnableSsoProps) => {
  const { translate } = useTranslate();
  const [showDisableDialog, setShowDisableDialog] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const alert = useAlert();
  const { teamId } = useTeamSpaceContext();
  const showErrorAlert = () => {
    alert.showAlert(
      ssoEnabled
        ? translate(I18N_KEYS.GENERIC_ERROR)
        : translate.markup(I18N_KEYS.TOGGLE_WARNING, undefined, {
            linkTarget: "_blank",
          }),
      AlertSeverity.ERROR
    );
  };
  const turnOnSso = async () => {
    if (!teamId) {
      return;
    }
    try {
      await updateTeamSettings({
        ssoEnabled: true,
      });
      logSelfHostedSSOSetupStep({
        ssoSetupStep: SsoSetupStep.CompleteSsoSetup,
      });
    } catch (error) {
      showErrorAlert();
    }
  };
  const handleToggleDialogVisibility = async () => {
    if (ssoEnabled) {
      setShowDisableDialog(true);
    } else {
      setShowConfirmDialog(true);
      logSelfHostedSSOSetupStep({
        ssoSetupStep: SsoSetupStep.TurnOnSso,
      });
    }
  };
  const closeDisableDialog = async (dialogAction: DialogAction) => {
    setShowDisableDialog(false);
    if (dialogAction === DialogAction.dismiss || !teamId) {
      return;
    }
    try {
      const toggleNewValue = !ssoEnabled;
      await updateTeamSettings({ ssoEnabled: toggleNewValue });
    } catch (error) {
      showErrorAlert();
    }
  };
  const onCancelConfirmationDialog = () => {
    setShowConfirmDialog(false);
  };
  const onConfirmConfirmationDialog = async () => {
    await turnOnSso();
    setShowConfirmDialog(false);
  };
  return (
    <>
      <GridContainer
        gap="8px"
        gridTemplateAreas="'header buttons' 'description toggle' "
        gridTemplateColumns="1fr auto"
      >
        <GridChild
          as={Paragraph}
          innerAs="h3"
          size="large"
          bold
          gridArea="header"
        >
          {translate(I18N_KEYS.ACTION_TITLE)}
        </GridChild>
        <GridChild
          gridArea="description"
          as={Paragraph}
          size="small"
          color={grey00}
        >
          {translate(I18N_KEYS.ACTION_DESCRIPTION)}
          <br />
          {translate(I18N_KEYS.ACTION_DESCRIPTION_NOTE)}
        </GridChild>

        <GridChild gridArea="toggle">
          <Toggle
            disabled={actionsDisabled || loading}
            checked={ssoEnabled}
            onChange={handleToggleDialogVisibility}
          />
        </GridChild>
      </GridContainer>
      {showDisableDialog ? (
        <DisableSsoDialog closeDialog={closeDisableDialog} />
      ) : null}
      {showConfirmDialog ? (
        <ConfirmDialog
          title={translate(I18N_KEYS.CONFIRM_DIALOG_TITLE)}
          body={translate(I18N_KEYS.CONFIRM_DIALOG_BODY)}
          primaryActionLabel={translate(
            I18N_KEYS.CONFIRM_DIALOG_PRIMARY_ACTION_LABEL
          )}
          onCancel={onCancelConfirmationDialog}
          onConfirm={onConfirmConfirmationDialog}
        />
      ) : null}
    </>
  );
};
