import { ReactNode } from "react";
import { Dialog, DialogProps } from "@dashlane/design-system";
import useTranslate from "../../../../libs/i18n/useTranslate";
export interface BaseDialogProps {
  onClose: () => void;
  isOpen?: boolean;
  isDestructive?: boolean;
}
export interface Props extends BaseDialogProps {
  title: string;
  content: ReactNode;
  confirmAction?: NonNullable<DialogProps["actions"]>["primary"];
  isScrollingDisabled?: boolean;
  shouldShowCancelButton?: boolean;
}
export const BaseDialog = ({
  title,
  content,
  confirmAction,
  onClose,
  isDestructive,
  isOpen = true,
  isScrollingDisabled = true,
  shouldShowCancelButton = true,
}: Props) => {
  const { translate } = useTranslate();
  return (
    <Dialog
      onClose={onClose}
      isOpen={isOpen}
      disableScrolling={isScrollingDisabled}
      closeActionLabel={translate("_common_dialog_dismiss_button")}
      title={title}
      titleProps={{
        id: "dialogTitle",
      }}
      isDestructive={isDestructive}
      actions={{
        primary: confirmAction ? confirmAction : undefined,
        secondary: shouldShowCancelButton
          ? {
              children: translate("_common_action_cancel"),
              onClick: (event) => {
                event.stopPropagation();
                onClose();
              },
            }
          : undefined,
      }}
    >
      {content}
    </Dialog>
  );
};
