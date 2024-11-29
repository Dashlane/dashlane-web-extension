import { Button } from "@dashlane/design-system";
import { Origin } from "@dashlane/hermes";
import { Permission } from "@dashlane/sharing-contracts";
import useTranslate from "../../../../libs/i18n/useTranslate";
import { ItemsTabs, SharingInviteStep } from "../../../sharing-invite/types";
import { SharingButton } from "../../../sharing-invite/sharing-button";
const I18N_KEYS = {
  SHARE_NEW_ITEM: "webapp_sharing_center_share_item_panel",
  CLOSE: "webapp_sharing_center_share_item_panel_close",
  SHARING_DISABLED: "team_sharing_disabled",
  SHARING_DISABLED_DESCRIPTION: "team_sharing_disabled_description",
};
export interface BottomPanelBarProps {
  selectedGroups?: string[];
  selectedUsers?: string[];
  onClose: () => void;
}
export const BottomPanelBar = ({
  selectedGroups = [],
  selectedUsers = [],
  onClose,
}: BottomPanelBarProps) => {
  const { translate } = useTranslate();
  return (
    <div
      sx={{
        bg: "ds.background.alternate",
        borderTop: "1px solid ds.border.neutral.quiet.idle",
        bottom: "0",
        display: "flex",
        justifyContent: "space-between",
        padding: "24px",
        position: "fixed",
        width: "640px",
      }}
    >
      <SharingButton
        sharing={{
          permission: Permission.Limited,
          selectedCredentials: [],
          selectedGroups,
          selectedNotes: [],
          selectedUsers,
          selectedPrivateCollections: [],
          selectedSharedCollections: [],
          selectedSecrets: [],
          step: SharingInviteStep.Elements,
          tab: ItemsTabs.Passwords,
        }}
        tooltipPlacement="top-start"
        text={translate(I18N_KEYS.SHARE_NEW_ITEM)}
        origin={Origin.ItemListView}
      />
      <Button intensity="quiet" mood="neutral" size="medium" onClick={onClose}>
        {translate(I18N_KEYS.CLOSE)}
      </Button>
    </div>
  );
};
