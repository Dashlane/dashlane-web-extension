import { Permission } from "@dashlane/sharing-contracts";
import { Origin } from "@dashlane/hermes";
import useTranslate from "../../../../libs/i18n/useTranslate";
import { ItemsTabs, SharingInviteStep } from "../../../sharing-invite/types";
import { SharingButton } from "../../../sharing-invite/sharing-button";
import { logStartSharingClick } from "../logs";
const I18N_KEYS = {
  SHARE: "webapp_sharing_center_empty_state_next_step_share",
};
export const SharingStep = () => {
  const { translate } = useTranslate();
  return (
    <SharingButton
      tooltipPlacement="bottom"
      text={translate(I18N_KEYS.SHARE)}
      mood="brand"
      intensity="catchy"
      layout="iconTrailing"
      icon="ArrowRightOutlined"
      buttonClick={logStartSharingClick}
      sharing={{
        permission: Permission.Limited,
        selectedCredentials: [],
        selectedGroups: [],
        selectedNotes: [],
        selectedUsers: [],
        selectedPrivateCollections: [],
        selectedSharedCollections: [],
        selectedSecrets: [],
        step: SharingInviteStep.Elements,
        tab: ItemsTabs.Passwords,
      }}
      origin={Origin.ItemListView}
    />
  );
};
