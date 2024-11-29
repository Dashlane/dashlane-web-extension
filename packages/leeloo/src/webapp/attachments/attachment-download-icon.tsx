import {
  colors,
  DownloadIcon,
  mergeSx,
  Tooltip,
} from "@dashlane/ui-components";
import { useCallback, useEffect } from "react";
import { UserDownloadVaultItemAttachmentEvent } from "@dashlane/hermes";
import { useModuleCommands } from "@dashlane/framework-react";
import { ProgressStatus, secureFilesApi } from "@dashlane/vault-contracts";
import useTranslate from "../../libs/i18n/useTranslate";
import { useTranslateWithMarkup } from "../../libs/i18n/useTranslateWithMarkup";
import { logEvent } from "../../libs/logs/logEvent";
import { SecureAttachmentProps } from "./types";
import { I18N_KEYS } from "./attachment-translation-keys";
import { actionCellSx, disableButtonSx } from "./attachments-ui";
interface AttachmentProgressProps {
  status: ProgressStatus;
}
type AttachmentDownloadIconContentProps = SecureAttachmentProps &
  AttachmentProgressProps;
export const AttachmentDownloadIcon = ({
  disableActions,
  setDisableActions,
  status,
  parentId,
  parentType,
  attachment,
}: AttachmentDownloadIconContentProps) => {
  const { translate } = useTranslate();
  const { translateWithMarkup } = useTranslateWithMarkup();
  const { downloadSecureFile } = useModuleCommands(secureFilesApi);
  const handleDownload = useCallback(async () => {
    await downloadSecureFile(attachment);
    if (parentId) {
      logEvent(
        new UserDownloadVaultItemAttachmentEvent({
          itemId: parentId,
          itemType: parentType,
        })
      );
    }
  }, [downloadSecureFile, attachment, parentId, parentType]);
  const handleKeyDown = (e: { keyCode: number }) => {
    if (e.keyCode === 13) {
      handleDownload();
    }
  };
  useEffect(() => {
    switch (status) {
      case ProgressStatus.Started:
      case ProgressStatus.Linked:
      case ProgressStatus.Fetched:
      case ProgressStatus.Ciphered:
        setDisableActions(true);
        break;
      case ProgressStatus.Completed:
      case ProgressStatus.Error:
        setDisableActions(false);
        break;
    }
  }, [status, setDisableActions, translateWithMarkup]);
  return (
    <Tooltip
      placement="left"
      trigger="hover"
      content={
        disableActions
          ? translateWithMarkup(
              I18N_KEYS.DOWNLOAD_BUTTON_TOOLTIP_CONTENT_DISABLE
            )
          : translateWithMarkup(
              I18N_KEYS.DOWNLOAD_BUTTON_TOOLTIP_CONTENT_ENABLE
            )
      }
    >
      <div
        role="link"
        aria-label={translate(I18N_KEYS.DOWNLOAD_BUTTON_TITLE)}
        sx={
          disableActions
            ? mergeSx([actionCellSx, disableButtonSx])
            : actionCellSx
        }
        tabIndex={0}
        onKeyDown={disableActions ? undefined : handleKeyDown}
        onClick={disableActions ? undefined : handleDownload}
      >
        <DownloadIcon
          sx={disableActions ? disableButtonSx : undefined}
          color={colors.dashGreen00}
          aria-hidden="true"
          aria-label={translate(I18N_KEYS.DOWNLOAD_BUTTON_TITLE)}
          title={translate(I18N_KEYS.DOWNLOAD_BUTTON_TITLE)}
        />
      </div>
    </Tooltip>
  );
};
