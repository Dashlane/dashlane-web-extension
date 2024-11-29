import { LinkAction } from "../types/action.types";
import { ActionType, GuideItemComponentProps } from "../types/item.types";
import { logLinkSharingCenterClick } from "../logs";
import { GuideItemComponent } from "./components/guide-item-component";
const I18N_KEYS = {
  TITLE: "onb_vault_get_started_link_share_item",
  ACTION: "onb_vault_get_started_link_btn_share_item",
};
export const ShareItemGuideItem = ({ status }: GuideItemComponentProps) => {
  const handleOpenSharing = () => {
    logLinkSharingCenterClick();
  };
  const action: LinkAction = {
    label: I18N_KEYS.ACTION,
    handler: handleOpenSharing,
    href: "userSharingCenter",
    type: ActionType.LINK,
  };
  return (
    <GuideItemComponent
      icon="ActionOpenExternalLinkOutlined"
      title={I18N_KEYS.TITLE}
      action={action}
      status={status}
    />
  );
};
