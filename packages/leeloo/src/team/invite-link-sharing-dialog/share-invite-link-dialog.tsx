import {
  Dialog,
  IndeterminateLoader,
  Paragraph,
  TextField,
  useToast,
} from "@dashlane/design-system";
import { DataStatus } from "@dashlane/framework-react";
import useTranslate from "../../libs/i18n/useTranslate";
import { useInviteLinkDataGraphene } from "../settings/hooks/use-invite-link";
import { getInviteLinkWithTeamKey } from "../urls";
const I18N_KEYS = {
  DIALOG_TITLE: "team_sharing_invite_dialog_title",
  DIALOG_PARAGRAPH: "team_sharing_invite_dialog_paragrah",
  INPUT_LABEL: "team_sharing_invite_dialog_input_label",
  COPY_BUTTON: "team_sharing_invite_dialog_copy_link",
  COPY_SUCCESS_TOAST: "team_sharing_invite_dialog_copied_notification",
  CLOSE: "_common_dialog_dismiss_button",
};
interface ShareInviteLinkDialogProps {
  isOpen: boolean;
  onClose: () => void;
}
export const ShareInviteLinkDialog = ({
  isOpen,
  onClose,
}: ShareInviteLinkDialogProps) => {
  const { translate } = useTranslate();
  const { showToast } = useToast();
  const inviteLinkResponse = useInviteLinkDataGraphene();
  const teamKey =
    inviteLinkResponse.status === DataStatus.Success
      ? inviteLinkResponse.teamKey
      : undefined;
  const inviteLink = getInviteLinkWithTeamKey(teamKey);
  const handleOnCopy = async () => {
    if (teamKey) {
      await navigator.clipboard.writeText(inviteLink);
      showToast({
        mood: "brand",
        description: translate(I18N_KEYS.COPY_SUCCESS_TOAST),
        closeActionLabel: translate(I18N_KEYS.CLOSE),
      });
    }
  };
  const handleOnClose = () => {
    onClose();
  };
  return (
    <Dialog
      isOpen={isOpen}
      onClose={handleOnClose}
      closeActionLabel={translate(I18N_KEYS.CLOSE)}
      title={translate(I18N_KEYS.DIALOG_TITLE)}
      actions={{
        primary: {
          children: teamKey ? (
            translate(I18N_KEYS.COPY_BUTTON)
          ) : (
            <IndeterminateLoader mood="inverse" />
          ),
          icon: teamKey ? "ActionCopyOutlined" : undefined,
          layout: "iconLeading",
          onClick: handleOnCopy,
        },
      }}
    >
      <Paragraph
        textStyle="ds.body.standard.regular"
        color="ds.text.neutral.standard"
      >
        {translate(I18N_KEYS.DIALOG_PARAGRAPH)}
      </Paragraph>

      <TextField
        label={translate(I18N_KEYS.INPUT_LABEL)}
        value={inviteLink}
        readOnly
        actions={[
          {
            label: translate(I18N_KEYS.COPY_BUTTON),
            iconName: "ActionCopyOutlined",
            onClick: handleOnCopy,
          },
        ]}
        sx={{
          overflow: "hidden",
        }}
      />
    </Dialog>
  );
};
