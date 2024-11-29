import { useCallback, useState } from "react";
import { Button, Dialog, Heading, Paragraph } from "@dashlane/design-system";
import useTranslate from "../../../../../libs/i18n/useTranslate";
import { logEvent } from "../../../../../libs/logs/logEvent";
import {
  ScimSetupStep,
  UserSetupConfidentialScimEvent,
} from "@dashlane/hermes";
import { scimApi } from "@dashlane/sso-scim-contracts";
import { useModuleCommands } from "@dashlane/framework-react";
const I18N_KEYS = {
  HEADER: "tac_settings_confidential_scim_generate_token_header",
  HEADER_HELPER: "tac_settings_confidential_scim_generate_token_header_helper",
  GENERATE_BUTTON: "tac_settings_confidential_scim_generate_token_button",
  REGENERATE_BUTTON: "tac_settings_confidential_scim_regenerate_token_button",
  DIALOG_TITLE: "tac_settings_confidential_scim_regenerate_token_dialog_title",
  DIALOG_CONTENT: "tac_settings_confidential_scim_regenerate_token_dialog",
  DIALOG_PRIMARY_ACTION:
    "tac_settings_confidential_scim_regenerate_token_dialog_primary_action",
  DIALOG_SECONDARY_ACTION:
    "tac_settings_confidential_scim_regenerate_token_dialog_secondary_action",
};
interface GenerateTokenProps {
  isTokenGenerated?: boolean;
}
export const GenerateToken = ({ isTokenGenerated }: GenerateTokenProps) => {
  const [isGenerating, setGenerating] = useState(false);
  const [isConfirmationDialogOpen, setConfirmationDialogOpen] = useState(false);
  const { translate } = useTranslate();
  const { generateScimToken } = useModuleCommands(scimApi);
  const generateToken = useCallback(async () => {
    setGenerating(true);
    await generateScimToken(undefined);
    logEvent(
      new UserSetupConfidentialScimEvent({
        scimSetupStep: isTokenGenerated
          ? ScimSetupStep.ReGenerateToken
          : ScimSetupStep.GenerateScimToken,
      })
    );
    setGenerating(false);
  }, [generateScimToken, isTokenGenerated]);
  return (
    <>
      <Heading
        as="h2"
        textStyle="ds.title.section.medium"
        sx={{ marginBottom: "8px" }}
      >
        {translate(I18N_KEYS.HEADER)}
      </Heading>
      <Paragraph
        textStyle="ds.body.standard.regular"
        sx={{ marginBottom: "24px" }}
      >
        {translate(I18N_KEYS.HEADER_HELPER)}
      </Paragraph>
      <Button
        intensity={isTokenGenerated ? "quiet" : "catchy"}
        mood="brand"
        isLoading={!isTokenGenerated && isGenerating}
        onClick={
          isTokenGenerated
            ? () => setConfirmationDialogOpen(true)
            : generateToken
        }
      >
        {translate(
          isTokenGenerated
            ? I18N_KEYS.REGENERATE_BUTTON
            : I18N_KEYS.GENERATE_BUTTON
        )}
      </Button>
      <Dialog
        actions={{
          primary: {
            children: translate(I18N_KEYS.DIALOG_PRIMARY_ACTION),
            onClick: () => {
              generateToken();
              setConfirmationDialogOpen(false);
            },
            isLoading: isGenerating,
          },
          secondary: {
            children: translate(I18N_KEYS.DIALOG_SECONDARY_ACTION),
            onClick: () => setConfirmationDialogOpen(false),
          },
        }}
        closeActionLabel="Close"
        onClose={() => setConfirmationDialogOpen(false)}
        title={translate(I18N_KEYS.DIALOG_TITLE)}
        isOpen={isConfirmationDialogOpen}
      >
        <Paragraph>{translate(I18N_KEYS.DIALOG_CONTENT)}</Paragraph>
      </Dialog>
    </>
  );
};
