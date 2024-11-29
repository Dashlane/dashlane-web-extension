import { DropdownItem, Tooltip } from "@dashlane/design-system";
import { SharedCollectionRole } from "@dashlane/sharing-contracts";
import useTranslate from "../../../../libs/i18n/useTranslate";
import { useCollectionPermissionsForUser } from "../../../sharing-invite/hooks/use-collection-permissions";
import { CollectionActionDisabledTooltip } from "./action-disabled-tooltip";
const I18N_KEYS = {
  ACTION_DISABLED_EDITOR: "webapp_collection_action_disabled_editor_title",
  ACTION_DISABLED_EDITOR_DESCRIPTION:
    "webapp_collection_action_disabled_editor_description",
};
interface Props {
  id: string;
  setIsDeleteDialogOpen: (isDeleteDialogOpen: boolean) => void;
}
export const DeleteButton = (props: Props) => {
  const { translate } = useTranslate();
  const { canDelete, role } = useCollectionPermissionsForUser(props.id);
  return (
    <Tooltip
      content={
        <CollectionActionDisabledTooltip
          tooltipTitle={translate(I18N_KEYS.ACTION_DISABLED_EDITOR)}
          tooltipDescription={translate(
            I18N_KEYS.ACTION_DISABLED_EDITOR_DESCRIPTION
          )}
        />
      }
      passThrough={role !== SharedCollectionRole.Editor}
      wrapTrigger
    >
      <DropdownItem
        label={translate("collections_delete_button_text")}
        leadingIcon="ActionDeleteOutlined"
        isDestructive={true}
        disabled={!canDelete}
        onSelect={() => props.setIsDeleteDialogOpen(true)}
      >
        {translate("collections_delete_button_text")}
      </DropdownItem>
    </Tooltip>
  );
};
