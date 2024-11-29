import { DropdownItem, Tooltip } from "@dashlane/design-system";
import { PageView } from "@dashlane/hermes";
import { SharedCollectionRole } from "@dashlane/sharing-contracts";
import useTranslate from "../../../../libs/i18n/useTranslate";
import { logPageView } from "../../../../libs/logs/logEvent";
import { useFrozenState } from "../../../../libs/frozen-state/frozen-state-dialog-context";
import { useCollectionPermissionsForUser } from "../../../sharing-invite/hooks/use-collection-permissions";
import { EditDialogCollectionProps } from "../dialogs";
import { CollectionActionDisabledTooltip } from "./action-disabled-tooltip";
const I18N_KEYS = {
  ACTION_DISABLED_EDITOR: "webapp_collection_action_disabled_editor_title",
  ACTION_DISABLED_EDITOR_DESCRIPTION:
    "webapp_collection_action_disabled_editor_description",
};
type Props = EditDialogCollectionProps & {
  setIsEditDialogOpen: (isDialogOpen: boolean) => void;
};
export const EditButton = (props: Props) => {
  const { translate } = useTranslate();
  const { canEdit } = useCollectionPermissionsForUser(props.id);
  const {
    openDialog: openTrialDiscontinuedDialog,
    shouldShowFrozenStateDialog,
  } = useFrozenState();
  const { role } = useCollectionPermissionsForUser(props.id);
  const handleClickOnEdit = () => {
    if (shouldShowFrozenStateDialog) {
      openTrialDiscontinuedDialog();
    } else {
      logPageView(PageView.CollectionEdit);
      props.setIsEditDialogOpen(true);
    }
  };
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
      location="left"
    >
      <DropdownItem
        label={translate("_common_action_edit")}
        leadingIcon="ActionEditOutlined"
        onSelect={handleClickOnEdit}
        disabled={!canEdit}
      >
        {translate("_common_action_edit")}
      </DropdownItem>
    </Tooltip>
  );
};
