import { ChangeEvent, memo } from "react";
import { Checkbox, Flex, Icon } from "@dashlane/design-system";
import { useModuleQuery } from "@dashlane/framework-react";
import {
  Permission,
  SharedCollectionRole,
  sharingItemsApi,
} from "@dashlane/sharing-contracts";
import { mergeSx, ThemeUIStyleObject } from "@dashlane/ui-components";
import { ParsedURL } from "@dashlane/url-parser";
import { NoteColors } from "@dashlane/vault-contracts";
import { Avatar } from "../../libs/dashlane-style/avatar/avatar";
import { CredentialThumbnail } from "../../libs/dashlane-style/credential-info/credential-thumbnail";
import { CredentialInfoSize } from "../../libs/dashlane-style/credential-info/credential-info";
import { DetailedItem } from "../../libs/dashlane-style/detailed-item";
import useTranslate from "../../libs/i18n/useTranslate";
import UserGroupLogo from "../../libs/dashlane-style/user-group-logo";
import { NoteIcon } from "../note-icon";
import { CollectionSharingRoles } from "../sharing-collection/sharing-collection-recipients";
import { SharingInviteItemSelect } from "./sharing-invite-item-select";
import searchIcon from "./svg/search.svg";
import SecuredIcon from "./svg/secured-misc.svg?inline";
import SharedIcon from "./svg/shared-status-misc.svg?inline";
import {
  SelectableItemType,
  useMultiselectUpdateContext,
} from "../list-view/multi-select/multi-select-context";
interface ItemProps {
  checked: boolean;
  id: string;
  freeLimitReached?: boolean;
  onRolesChanged?: (roles: CollectionSharingRoles[]) => void;
  roles?: CollectionSharingRoles[];
  style?: React.CSSProperties;
  canShareCollection?: boolean;
  isStarterAdmin?: boolean;
  isSecured?: boolean;
  autoProtected?: boolean;
  hasAttachments?: boolean;
  text?: string;
  title: string;
  type: SelectableItemType;
  onSelectItem: (
    itemId: string,
    type: SelectableItemType,
    event: ChangeEvent,
    getType?: (item: { id?: string; groupId?: string }) => SelectableItemType
  ) => void;
  url?: string;
  logoColor?: NoteColors;
  getType?: (item: { id?: string; groupId?: string }) => SelectableItemType;
}
export const SHARING_INVITE_CONTENT_HEIGHT =
  "calc(100vh - 68px - 108px - 80px)";
const ITEM_HEIGHT = 56;
const AVATAR_SIZE = ITEM_HEIGHT - 20;
export const itemSx: ThemeUIStyleObject = {
  alignItems: "center",
  borderBottomWidth: "1px",
  borderBottomStyle: "solid",
  borderBottomColor: "ds.border.neutral.quiet.idle",
  display: "flex",
  justifyContent: "space-between",
  minHeight: "56px",
  position: "relative",
  backgroundColor: "ds.background.default",
  ":last-of-type": {
    borderBottom: "none",
  },
  gap: "8px",
};
const disabledItemSx: ThemeUIStyleObject = {
  opacity: 0.5,
  cursor: "auto",
};
export const ItemNotFound = ({ text }: { text: string }) => {
  return (
    <Flex
      justifyContent="space-around"
      alignItems="center"
      sx={{
        height: "100%",
        minHeight: "347px",
      }}
    >
      <Flex
        justifyContent="space-around"
        alignItems="center"
        flexDirection="column"
        sx={{
          maxWidth: "400px",
        }}
      >
        <img src={searchIcon} />
        <span
          sx={{
            color: "ds.text.neutral.quiet",
            marginTop: "20px",
            lineHeight: "20px",
            textAlign: "center",
          }}
        >
          {text}
        </span>
      </Flex>
    </Flex>
  );
};
export function getCredentialLogo(itemName: string, URL?: string) {
  return (
    <CredentialThumbnail
      size={CredentialInfoSize.SMALL}
      title={itemName}
      domain={new ParsedURL(URL).getRootDomain()}
      nativeIcon={undefined}
    />
  );
}
const titleIconSx = {
  marginLeft: "4px",
  path: {
    fill: "ds.text.neutral.quiet",
  },
};
export const getTitleLogo = (
  isShared: boolean,
  isSecured: boolean,
  hasAttachments?: boolean
): React.ReactNode => (
  <span sx={{ display: "flex", alignItems: "center" }}>
    {isShared && <SharedIcon sx={titleIconSx} />}
    {isSecured && <SecuredIcon sx={titleIconSx} />}
    {hasAttachments && <Icon name="AttachmentOutlined" sx={titleIconSx} />}
  </span>
);
const Item = (props: ItemProps) => {
  const {
    checked,
    id,
    onRolesChanged,
    roles,
    style,
    freeLimitReached,
    canShareCollection,
    isStarterAdmin,
    isSecured,
    autoProtected,
    hasAttachments,
    text,
    title,
    type,
    url,
    logoColor,
    onSelectItem,
    getType,
  } = props;
  const { data: sharingData } = useModuleQuery(
    sharingItemsApi,
    "getPermissionForItem",
    {
      itemId: id ?? "",
    }
  );
  const { translate } = useTranslate();
  const { toggleSelectedItems } = useMultiselectUpdateContext();
  const isShared = !!sharingData?.permission;
  const titleLogo = getTitleLogo(
    isShared ?? false,
    !!isSecured || !!autoProtected
  );
  const disabled =
    canShareCollection === false ||
    (!!id && freeLimitReached && !checked && !isShared) ||
    sharingData?.permission === Permission.Limited;
  if (checked && disabled) {
    toggleSelectedItems(new Set([id]), type);
    return null;
  }
  const handleCheck = (event: ChangeEvent) => {
    onSelectItem(id, type, event, getType);
    if (roles && onRolesChanged) {
      const updatedRoles = [...roles];
      updatedRoles.push({ id, role: SharedCollectionRole.Editor });
      onRolesChanged(updatedRoles);
    }
  };
  const getLogo = () => {
    switch (type) {
      case "credentials":
        return getCredentialLogo(title, url);
      case "notes":
        return <NoteIcon noteType={logoColor ?? ""} />;
      case "secrets":
        return (
          <Icon name="ItemSecretOutlined" color="ds.text.neutral.standard" />
        );
      case "users":
        return <Avatar email={id} size={AVATAR_SIZE} />;
      case "groups":
        return <UserGroupLogo />;
    }
  };
  const shouldRenderSharingInviteItemSelect =
    checked && roles && onRolesChanged && id;
  if (hasAttachments) {
    return null;
  }
  return (
    <li
      sx={disabled ? mergeSx([itemSx, disabledItemSx]) : itemSx}
      style={style}
    >
      <Checkbox
        checked={checked}
        disabled={disabled}
        onChange={handleCheck}
        aria-label={translate("webapp_sharing_invite_aria_label_checkbox", {
          name: title,
        })}
        tooltip={
          sharingData?.permission === Permission.Limited &&
          translate("webapp_sharing_invite_limited_rights_tooltip")
        }
      />
      <DetailedItem
        title={title}
        logo={getLogo()}
        titleLogo={titleLogo}
        text={text}
        disabled={disabled}
      />
      {shouldRenderSharingInviteItemSelect && (
        <SharingInviteItemSelect
          id={id}
          roles={roles}
          onRolesChanged={onRolesChanged}
          isStarterAdmin={isStarterAdmin}
        />
      )}
    </li>
  );
};
export const ShareInviteItem = memo(Item);
