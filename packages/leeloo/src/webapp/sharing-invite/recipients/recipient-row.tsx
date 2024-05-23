import { SharingUserView, UserGroupDownload } from '@dashlane/communication';
import { Button, jsx } from '@dashlane/design-system';
import { Avatar } from 'libs/dashlane-style/avatar/avatar';
import UserGroupLogo from 'libs/dashlane-style/user-group-logo';
import useTranslate from 'libs/i18n/useTranslate';
import { DetailedItem } from 'libs/dashlane-style/detailed-item';
import { Item } from '../item';
import { CollectionSharingRoles } from './sharing-collection-recipients';
const ITEM_HEIGHT = 56;
const AVATAR_SIZE = ITEM_HEIGHT - 20;
const I18N_KEYS = {
    ADD_CONTACT: 'webapp_sharing_invite_add_new_contact',
    INVITE_MEMBERS: 'webapp_sharing_invite_members',
};
interface NewContactRowProps {
    addNewContact?: () => void;
    email: string;
}
export const NewContactRow = ({ addNewContact, email }: NewContactRowProps) => {
    const { translate } = useTranslate();
    return (<li key="new_contact" sx={{
            alignItems: 'center',
            borderBottomWidth: '1px',
            borderBottomStyle: 'solid',
            borderBottomColor: 'ds.border.neutral.quiet.idle',
            display: 'flex',
            minHeight: `${ITEM_HEIGHT}px`,
            overflow: 'hidden',
            position: 'relative',
        }}>
      <DetailedItem infoAction={<Button intensity="quiet" mood="neutral" size="medium" onClick={addNewContact}>
            {translate(I18N_KEYS.ADD_CONTACT)}
          </Button>} logo={<Avatar email={email} size={AVATAR_SIZE}/>} text="" title={email}/>
    </li>);
};
interface RecipientRowProps {
    group?: UserGroupDownload;
    isUserItem: boolean;
    onCheckGroup: (userId: string, checked: boolean) => void;
    onCheckUser: (userId: string, checked: boolean) => void;
    onRolesChanged?: (roles: CollectionSharingRoles[]) => void;
    roles?: CollectionSharingRoles[];
    selectedGroups: string[];
    selectedUsers: string[];
    style: React.CSSProperties;
    user?: SharingUserView;
    canShareCollection?: boolean;
    isStarterAdmin?: boolean;
}
export const RecipientRow = ({ group, isUserItem, onCheckGroup, onCheckUser, selectedGroups, selectedUsers, style, user, canShareCollection, isStarterAdmin, ...rest }: RecipientRowProps) => {
    const { translate } = useTranslate();
    const id = (isUserItem ? user?.id : group?.groupId) ?? '';
    const isChecked = isUserItem
        ? selectedUsers.includes(id)
        : selectedGroups.includes(id);
    const usersCount = (group?.users ?? []).length;
    const text = isUserItem
        ? ''
        : translate(I18N_KEYS.INVITE_MEMBERS, { count: usersCount });
    const title = (isUserItem ? id : group?.name) ?? '';
    const onCheck = (isChecked: boolean) => isUserItem ? onCheckUser(id, isChecked) : onCheckGroup(id, isChecked);
    return (<Item id={id} key={`${id}-row`} checked={isChecked} logo={isUserItem ? (<Avatar email={id} size={AVATAR_SIZE}/>) : (<UserGroupLogo />)} onCheck={onCheck} text={text} title={title} style={style} item={group} canShareCollection={canShareCollection} isStarterAdmin={isStarterAdmin} {...rest}/>);
};
