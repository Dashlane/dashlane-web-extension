import { useState } from "react";
import { useModuleCommands } from "@dashlane/framework-react";
import { confidentialSSOApi } from "@dashlane/sso-scim-contracts";
import {
  Button,
  Dialog,
  Infobox,
  Paragraph,
  useToast,
} from "@dashlane/design-system";
import { useTeamSpaceContext } from "../settings/components/TeamSpaceContext";
import useTranslate from "../../libs/i18n/useTranslate";
const I18N_KEYS = {
  DIALOG_CLOSE: "_common_dialog_dismiss_button",
  DIALOG_TITLE: "team_integrations_confidential_reset_dialog_title",
  DIALOG_DESCRIPTION: "team_integrations_confidential_reset_dialog_description",
  DIALOG_DELETE_BUTTON:
    "team_integrations_confidential_reset_dialog_delete_button",
  DIALOG_CANCEL_BUTTON: "_common_action_cancel",
  ERROR_GENERIC: "team_integrations_confidential_reset_dialog_generic_error",
  INFOBOX_TITLE: "team_integrations_confidential_reset_infobox_title",
  INFOBOX_DESCRIPTION:
    "team_integrations_confidential_reset_infobox_description",
  INFOBOX_DELETE_BUTTON:
    "team_integrations_confidential_reset_infobox_delete_button",
  TOAST_DESCRIPITON: "team_integrations_confidential_reset_toast_description",
  TOAST_CLOSE_LABEL: "_common_toast_close_label",
};
interface ResetDialogProps {
  isOpen: boolean;
  onClose: () => void;
}
export const ResetDialog = ({ isOpen, onClose }: ResetDialogProps) => {
  const { teamId } = useTeamSpaceContext();
  const { clearSettings } = useModuleCommands(confidentialSSOApi);
  const { translate } = useTranslate();
  const { showToast } = useToast();
  const [resetInProgress, setResetInProgress] = useState(false);
  const [error, setError] = useState(false);
  const handleClick = async () => {
    setError(false);
    if (!teamId) {
      throw new Error("teamId not found");
    }
    try {
      setResetInProgress(true);
      await clearSettings({ teamId });
      onClose();
      showToast({
        description: translate(I18N_KEYS.TOAST_DESCRIPITON),
        closeActionLabel: translate(I18N_KEYS.TOAST_CLOSE_LABEL),
      });
    } catch (e) {
      setError(true);
    } finally {
      setResetInProgress(false);
    }
  };
  return (
    <Dialog
      isDestructive
      isOpen={isOpen}
      onClose={onClose}
      title={translate(I18N_KEYS.DIALOG_TITLE)}
      closeActionLabel={translate(I18N_KEYS.DIALOG_CLOSE)}
    >
      <div sx={{ display: "flex", flexDirection: "column", gap: "32px" }}>
        <Paragraph>{translate(I18N_KEYS.DIALOG_DESCRIPTION)}</Paragraph>
        <div
          sx={{
            alignItems: "flex-end",
            display: "flex",
            flexDirection: "column",
            gap: "8px",
          }}
        >
          <div sx={{ display: "flex", gap: "8px", justifyContent: "flex-end" }}>
            <Button
              disabled={resetInProgress}
              mood="neutral"
              onClick={handleClick}
            >
              {translate(I18N_KEYS.DIALOG_CANCEL_BUTTON)}
            </Button>
            <Button
              isLoading={resetInProgress}
              mood="danger"
              onClick={handleClick}
            >
              {translate(I18N_KEYS.DIALOG_DELETE_BUTTON)}
            </Button>
          </div>
          {error ? (
            <Paragraph
              color="ds.text.danger.quiet"
              textStyle="ds.body.helper.regular"
            >
              {translate(I18N_KEYS.ERROR_GENERIC)}
            </Paragraph>
          ) : null}
        </div>
      </div>
    </Dialog>
  );
};
export const IntegrationsReset = () => {
  const { translate } = useTranslate();
  const [dialogOpen, setDialogOpen] = useState(false);
  return (
    <>
      <Infobox
        actions={[
          <Button
            key="delete-confidential-integrations"
            mood="danger"
            onClick={() => setDialogOpen(true)}
          >
            {translate(I18N_KEYS.INFOBOX_DELETE_BUTTON)}
          </Button>,
        ]}
        description={translate(I18N_KEYS.INFOBOX_DESCRIPTION)}
        icon="FeedbackWarningOutlined"
        mood="danger"
        size="large"
        title={translate(I18N_KEYS.INFOBOX_TITLE)}
      />
      <ResetDialog isOpen={dialogOpen} onClose={() => setDialogOpen(false)} />
    </>
  );
};
