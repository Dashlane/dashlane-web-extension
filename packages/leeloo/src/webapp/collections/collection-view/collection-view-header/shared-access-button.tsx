import { DropdownItem } from "@dashlane/design-system";
import {
  Origin,
  SharingFlowType,
  UserSharingStartEvent,
} from "@dashlane/hermes";
import useTranslate from "../../../../libs/i18n/useTranslate";
import { logEvent } from "../../../../libs/logs/logEvent";
interface SharedAccessButtonProps {
  id: string;
  setIsSharedAccessDialogOpen: (value: boolean) => void;
}
export const SharedAccessButton = ({
  id,
  setIsSharedAccessDialogOpen,
}: SharedAccessButtonProps) => {
  const { translate } = useTranslate();
  const onSharedButtonClicked = () => {
    logEvent(
      new UserSharingStartEvent({
        sharingFlowType: SharingFlowType.CollectionSharing,
        collectionId: id,
        origin: Origin.CollectionDetailView,
      })
    );
    setIsSharedAccessDialogOpen(true);
  };
  return (
    <DropdownItem
      label={translate("webapp_sharing_collection_access_dialog_title")}
      leadingIcon="SharedOutlined"
      onSelect={onSharedButtonClicked}
    >
      {translate("webapp_sharing_collection_access_dialog_title")}
    </DropdownItem>
  );
};
