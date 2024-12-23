import { useCallback, useState } from "react";
import { Action, UserUpdateVaultItemAttachmentEvent } from "@dashlane/hermes";
import {
  AlertSeverity,
  colors,
  Dialog,
  DialogBody,
  DialogFooter,
  Heading,
  mergeSx,
  Paragraph,
  Tooltip,
  TrashIcon,
} from "@dashlane/ui-components";
import { useAlert } from "../../libs/alert-notifications/use-alert";
import useTranslate from "../../libs/i18n/useTranslate";
import { useTranslateWithMarkup } from "../../libs/i18n/useTranslateWithMarkup";
import { logEvent } from "../../libs/logs/logEvent";
import { formatName } from "../secure-files/helpers/filename-format";
import { useSecureFileDelete } from "../secure-files/hooks";
import { editPanelIgnoreClickOutsideClassName } from "../variables";
import { I18N_KEYS } from "./attachment-translation-keys";
import { actionCellSx, disableButtonSx } from "./attachments-ui";
import { SecureAttachmentProps } from "./types";
export const AttachmentDeleteIcon = ({
  attachment,
  disableActions,
  handleFileInfoDetached,
  onModalDisplayStateChange,
  parentId,
  parentType,
}: SecureAttachmentProps) => {
  const { translate } = useTranslate();
  const { translateWithMarkup } = useTranslateWithMarkup();
  const alert = useAlert();
  const [isOpen, setIsOpen] = useState(false);
  const setError = useCallback(
    () =>
      alert.showAlert(
        translateWithMarkup(I18N_KEYS.UNKNOWN_ERROR),
        AlertSeverity.ERROR
      ),
    [alert, translateWithMarkup]
  );
  const deleteFile = useSecureFileDelete(
    parentType,
    setError,
    handleFileInfoDetached
  );
  const handleOnOpenDialog = () => {
    setIsOpen(true);
    onModalDisplayStateChange?.(true);
  };
  const handleOnCloseDialog = () => {
    setIsOpen(false);
    onModalDisplayStateChange?.(false);
  };
  const handleKeyDown = (e: { keyCode: number }) => {
    if (e.keyCode === 13) {
      handleOnOpenDialog();
    }
  };
  const handleOnDelete = () => {
    if (parentId) {
      logEvent(
        new UserUpdateVaultItemAttachmentEvent({
          attachmentAction: Action.Delete,
          itemId: parentId,
          itemType: parentType,
        })
      );
    }
    deleteFile(attachment.id);
    alert.showAlert(
      translate(I18N_KEYS.DELETE_SUCCESS, {
        fileName: formatName(attachment.filename),
      }),
      AlertSeverity.SUCCESS
    );
    setIsOpen(false);
  };
  return (
    <>
      <Tooltip
        placement="left"
        trigger="hover"
        content={
          disableActions
            ? translateWithMarkup(
                I18N_KEYS.DELETE_BUTTON_TOOLTIP_CONTENT_DISABLE
              )
            : translateWithMarkup(
                I18N_KEYS.DELETE_BUTTON_TOOLTIP_CONTENT_ENABLE
              )
        }
      >
        <div
          role="button"
          aria-label={translate(I18N_KEYS.DELETE_BUTTON_TITLE)}
          sx={
            disableActions
              ? mergeSx([actionCellSx, disableButtonSx])
              : actionCellSx
          }
          tabIndex={0}
          onKeyDown={handleKeyDown}
          onClick={handleOnOpenDialog}
        >
          <TrashIcon
            color={colors.dashGreen00}
            aria-hidden="true"
            title={translate(I18N_KEYS.DELETE_BUTTON_TITLE)}
            aria-label={translate(I18N_KEYS.DELETE_BUTTON_TITLE)}
          />
        </div>
      </Tooltip>
      <Dialog
        isOpen={isOpen && !disableActions}
        onClose={handleOnCloseDialog}
        closeIconName="CloseIcon"
        modalContentClassName={editPanelIgnoreClickOutsideClassName}
      >
        <DialogBody>
          <Heading
            size="small"
            sx={{ margin: "16px 0px", fontWeight: "bolder" }}
          >
            {translateWithMarkup(I18N_KEYS.DELETE_CONFIRM_DIALOG_HEADING)}
          </Heading>
          <Paragraph sx={{ margin: "8px 0px" }} color={colors.grey00}>
            {translateWithMarkup(I18N_KEYS.DELETE_CONFIRM_DIALOG_PARAGRAPH)}
          </Paragraph>
        </DialogBody>
        <DialogFooter
          primaryButtonTitle={translateWithMarkup(
            I18N_KEYS.DELETE_CONFIRM_DIALOG_PRIMARY_BUTTON_TITLE
          )}
          primaryButtonOnClick={handleOnDelete}
          secondaryButtonTitle={translateWithMarkup(
            I18N_KEYS.DELETE_CONFIRM_DIALOG_SECONDARY_BUTTON_TITLE
          )}
          secondaryButtonOnClick={handleOnCloseDialog}
          intent="danger"
        />
      </Dialog>
    </>
  );
};
