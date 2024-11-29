import { useEffect, useState } from "react";
import {
  ButtonProps,
  DropdownContent,
  DropdownMenu,
  DropdownTriggerButton,
} from "@dashlane/design-system";
import { ShareableCollection } from "@dashlane/sharing-contracts";
import { PageView } from "@dashlane/hermes";
import {
  DeleteDialog,
  EditDialog,
  SharedAccessDialog,
} from "../../../collections/collection-view/dialogs";
import useTranslate from "../../../../libs/i18n/useTranslate";
import { logPageView } from "../../../../libs/logs/logEvent";
import { useDialog } from "../../../dialog";
import { CollectionQuickActionOptions } from "./collection-quick-action-options";
interface Props {
  collection: ShareableCollection;
  triggerButton?: Pick<ButtonProps, "intensity" | "mood" | "size">;
  className?: string;
}
export const ActionsMenu = ({
  collection,
  className,
  triggerButton,
}: Props) => {
  const { openDialog, closeDialog, isDialogVisible } = useDialog();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { translate } = useTranslate();
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const { id, name, spaceId, isShared } = collection;
  useEffect(() => {
    if (isEditDialogOpen) {
      logPageView(PageView.CollectionEdit);
    }
    if (isDeleteDialogOpen) {
      logPageView(PageView.CollectionDelete);
    }
  }, [isEditDialogOpen, isDeleteDialogOpen]);
  const onClickSharedAccessAction = () => {
    openDialog(<SharedAccessDialog id={id} onClose={closeDialog} />);
  };
  return (
    <DropdownMenu
      isOpen={isDropdownOpen}
      onOpenChange={() =>
        isDialogVisible ? false : setIsDropdownOpen(!isDropdownOpen)
      }
    >
      <DropdownTriggerButton
        aria-label={translate("webapp_credentials_grid_item_more_actions")}
        icon="ActionMoreOutlined"
        layout="iconOnly"
        intensity="supershy"
        mood="brand"
        size="medium"
        className={className}
        onClick={(event) => {
          event.stopPropagation();
          logPageView(PageView.CollectionQuickActionsDropdown);
        }}
        {...triggerButton}
      />

      <DropdownContent>
        <CollectionQuickActionOptions
          collection={collection}
          setIsEditDialogOpen={setIsEditDialogOpen}
          setIsDeleteDialogOpen={setIsDeleteDialogOpen}
        />
      </DropdownContent>

      {isEditDialogOpen && (
        <EditDialog
          id={id}
          name={name}
          spaceId={spaceId}
          onClose={() => setIsEditDialogOpen(false)}
          isShared={isShared}
        />
      )}
      {isDeleteDialogOpen && (
        <DeleteDialog
          isShared={isShared}
          id={id}
          name={name}
          onClose={() => setIsDeleteDialogOpen(false)}
          setIsSharedAccessDialogOpen={onClickSharedAccessAction}
        />
      )}
    </DropdownMenu>
  );
};
