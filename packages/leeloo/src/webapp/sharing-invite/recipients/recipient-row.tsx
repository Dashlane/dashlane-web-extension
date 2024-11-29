import { ChangeEvent } from "react";
import { SharingUserView } from "@dashlane/communication";
import { Button } from "@dashlane/design-system";
import { SharingGroup } from "@dashlane/sharing-contracts";
import { Avatar } from "../../../libs/dashlane-style/avatar/avatar";
import useTranslate from "../../../libs/i18n/useTranslate";
import { DetailedItem } from "../../../libs/dashlane-style/detailed-item";
import { ShareInviteItem } from "../item";
import { CollectionSharingRoles } from "../../sharing-collection/sharing-collection-recipients";
import {
  SelectableItemType,
  useMultiselectContext,
} from "../../list-view/multi-select/multi-select-context";
const ITEM_HEIGHT = 56;
const AVATAR_SIZE = ITEM_HEIGHT - 20;
const I18N_KEYS = {
  ADD_CONTACT: "webapp_sharing_invite_add_new_contact",
  INVITE_MEMBERS: "webapp_sharing_invite_members",
};
interface NewContactRowProps {
  addNewContact?: () => void;
  email: string;
}
export const NewContactRow = ({ addNewContact, email }: NewContactRowProps) => {
  const { translate } = useTranslate();
  return (
    <li
      key="new_contact"
      sx={{
        alignItems: "center",
        borderBottomWidth: "1px",
        borderBottomStyle: "solid",
        borderBottomColor: "ds.border.neutral.quiet.idle",
        display: "flex",
        minHeight: `${ITEM_HEIGHT}px`,
        overflow: "hidden",
        position: "relative",
      }}
    >
      <DetailedItem
        infoAction={
          <Button
            intensity="quiet"
            mood="neutral"
            size="medium"
            onClick={addNewContact}
          >
            {translate(I18N_KEYS.ADD_CONTACT)}
          </Button>
        }
        logo={<Avatar email={email} size={AVATAR_SIZE} />}
        text=""
        title={email}
      />
    </li>
  );
};
interface RecipientRowProps {
  group?: SharingGroup;
  isUserItem: boolean;
  onRolesChanged?: (roles: CollectionSharingRoles[]) => void;
  roles?: CollectionSharingRoles[];
  style: React.CSSProperties;
  user?: SharingUserView;
  canShareCollection?: boolean;
  isStarterAdmin?: boolean;
  onSelectItem: (
    itemId: string,
    type: SelectableItemType,
    event: ChangeEvent
  ) => void;
}
export const RecipientRow = ({
  group,
  isUserItem,
  style,
  user,
  canShareCollection,
  isStarterAdmin,
  onSelectItem,
  ...rest
}: RecipientRowProps) => {
  const { translate } = useTranslate();
  const { isSelected } = useMultiselectContext();
  const id = (isUserItem ? user?.id : group?.id) ?? "";
  const isChecked = isSelected(id, isUserItem ? "users" : "groups");
  const usersCount = (group?.users ?? []).length;
  const text = isUserItem
    ? ""
    : translate(I18N_KEYS.INVITE_MEMBERS, { count: usersCount });
  const title = (isUserItem ? id : group?.name) ?? "";
  return (
    <ShareInviteItem
      id={id}
      key={`${id}-row`}
      checked={isChecked}
      text={text}
      title={title}
      style={style}
      canShareCollection={canShareCollection}
      isStarterAdmin={isStarterAdmin}
      type={isUserItem ? "users" : "groups"}
      onSelectItem={onSelectItem}
      getType={(item) => ((item as SharingGroup).users ? "groups" : "users")}
      {...rest}
    />
  );
};
