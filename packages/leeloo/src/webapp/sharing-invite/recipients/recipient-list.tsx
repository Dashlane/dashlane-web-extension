import { forwardRef, Fragment } from 'react';
import { FixedSizeList } from 'react-window';
import { jsx, ThemeUIStyleObject } from '@dashlane/design-system';
import { SharingUserView } from '@dashlane/communication';
import { isValidEmail } from 'libs/validators';
import useTranslate from 'libs/i18n/useTranslate';
import { sortGroups } from '../helpers';
import { ItemNotFound } from '../item';
import { useAcceptedUserGroups } from 'webapp/sharing-invite/hooks/useAcceptedUserGroups';
import { NewContactRow, RecipientRow } from './recipient-row';
import { getGroupOrUserId, getGroupsFilteredByQuery, getUsersFilteredByQuery, } from './recipient-list-helpers';
import { sanitizeEmail } from './utils';
import { CollectionSharingRoles } from './sharing-collection-recipients';
const LIST_HEIGHT = 347;
const ITEM_HEIGHT = 56;
const ADD_NEW_HEIGHT = 72;
const LIST_BORDER_STYLES: ThemeUIStyleObject = {
    borderTopWidth: '1px',
    borderTopStyle: 'solid',
    borderTopColor: 'ds.border.neutral.quiet.idle',
};
const I18N_KEYS = {
    NONE_FOUND: 'webapp_sharing_invite_no_recipients_found',
    NO_RECIPIENTS: 'webapp_sharing_invite_no_recipients',
    NO_SELECTED: 'webapp_sharing_invite_no_selected_recipients_found',
};
interface RecipientsListProps {
    addNewContact?: () => void;
    onCheckGroup: (userId: string, checked: boolean) => void;
    onCheckUser: (userId: string, checked: boolean) => void;
    onRolesChanged?: (roles: CollectionSharingRoles[]) => void;
    roles?: CollectionSharingRoles[];
    query: string;
    recipientsOnlyShowSelected: boolean;
    selectedGroups: string[];
    selectedUsers: string[];
    users: SharingUserView[];
    allowNewContacts: boolean;
    canShareCollection?: boolean;
    isStarterAdmin?: boolean;
}
export const RecipientsList = forwardRef<FixedSizeList, RecipientsListProps>((props, ref) => {
    const { addNewContact, onCheckGroup, onCheckUser, query, recipientsOnlyShowSelected, selectedGroups, selectedUsers, users, allowNewContacts, canShareCollection, isStarterAdmin, ...rest } = props;
    const { translate } = useTranslate();
    const groups = useAcceptedUserGroups();
    const sortedGroups = sortGroups(groups);
    const queryIsEmail = isValidEmail(query);
    if (users.length === 0 && sortedGroups.length === 0 && !queryIsEmail) {
        return <ItemNotFound text={translate(I18N_KEYS.NO_RECIPIENTS)}/>;
    }
    const queriedGroups = getGroupsFilteredByQuery(sortedGroups, query);
    const queriedUsers = getUsersFilteredByQuery(users, query);
    const hasListResults = queriedUsers.length > 0 || queriedGroups.length > 0;
    if (!hasListResults && queryIsEmail && allowNewContacts) {
        return (<ul sx={{
                ...LIST_BORDER_STYLES,
                height: LIST_HEIGHT,
            }}>
          <NewContactRow email={sanitizeEmail(query)} addNewContact={addNewContact}/>
        </ul>);
    }
    const filteredGroups = queriedGroups.filter((group) => {
        if (!recipientsOnlyShowSelected) {
            return true;
        }
        return selectedGroups.includes(group.groupId);
    });
    const filteredUsers = queriedUsers.filter((user) => {
        if (!recipientsOnlyShowSelected) {
            return true;
        }
        return selectedUsers.includes(user.id);
    });
    if (filteredUsers.length === 0 && filteredGroups.length === 0) {
        const copy = recipientsOnlyShowSelected
            ? translate(I18N_KEYS.NO_SELECTED)
            : translate(I18N_KEYS.NONE_FOUND);
        return <ItemNotFound text={copy}/>;
    }
    const filteredGroupsCount = filteredGroups.length;
    const filteredUsersCount = filteredUsers.length;
    const getId = (index: number) => getGroupOrUserId(index, filteredGroupsCount, filteredUsers, filteredGroups);
    const exactUserMatch = users.some(({ id = '' }: SharingUserView): boolean => !query || id.toLowerCase() === query.trim().toLowerCase());
    const showAddNewWithSearch = queryIsEmail && !exactUserMatch;
    return (<>
        {showAddNewWithSearch ? (<ul sx={{
                ...LIST_BORDER_STYLES,
                height: hasListResults ? ADD_NEW_HEIGHT : LIST_HEIGHT,
            }}>
            <NewContactRow email={query} addNewContact={addNewContact}/>
          </ul>) : null}
        <FixedSizeList sx={showAddNewWithSearch ? LIST_BORDER_STYLES : undefined} height={LIST_HEIGHT - (showAddNewWithSearch ? ADD_NEW_HEIGHT : 0)} itemCount={filteredGroupsCount + filteredUsersCount} itemKey={getId} itemSize={ITEM_HEIGHT} outerElementType="ul" width="100%" ref={ref}>
          {({ index, style }) => (<RecipientRow isUserItem={index > filteredGroupsCount - 1} onCheckGroup={onCheckGroup} onCheckUser={onCheckUser} selectedGroups={selectedGroups} selectedUsers={selectedUsers} style={style} user={filteredUsers[index - filteredGroupsCount]} group={filteredGroups[index]} canShareCollection={canShareCollection} isStarterAdmin={isStarterAdmin} {...rest}/>)}
        </FixedSizeList>
      </>);
});
