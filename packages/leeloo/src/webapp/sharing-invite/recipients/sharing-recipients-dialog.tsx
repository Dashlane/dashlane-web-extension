import { ChangeEventHandler, Fragment, useRef, useState } from 'react';
import { FixedSizeList } from 'react-window';
import { DataStatus } from '@dashlane/carbon-api-consumers';
import { Checkbox, Heading, IndeterminateLoader, jsx, Paragraph, SearchField, } from '@dashlane/design-system';
import { DialogBody, DialogFooter } from '@dashlane/ui-components';
import useTranslate from 'libs/i18n/useTranslate';
import { useTeamSpaceContext } from 'team/settings/components/TeamSpaceContext';
import { useSharingUsers } from 'webapp/sharing-center/sharing-users/useSharingUsers';
import { sortUsers } from '../helpers';
import { useAcceptedUserGroups } from '../hooks/useAcceptedUserGroups';
import { RecipientsList } from './recipient-list';
import { sanitizeEmail } from './utils';
import { getGroupsFilteredByQuery, getUsersFilteredByQuery, } from './recipient-list-helpers';
import { CollectionSharingRoles } from './sharing-collection-recipients';
const I18N_KEYS = {
    CLEAR: 'webapp_sharing_invite_clear',
    PLACEHOLDER: 'webapp_sharing_invite_recipients_placeholder',
    SHOW_SELECTED: 'webapp_sharing_invite_only_show_selected_people',
};
export interface SharingRecipientsDialogProps {
    newUsers: string[];
    onCheckGroup: (groupId: string, checked: boolean) => void;
    onCheckUser: (userId: string, checked: boolean) => void;
    onRolesChanged?: (roles: CollectionSharingRoles[]) => void;
    roles?: CollectionSharingRoles[];
    recipientsOnlyShowSelected: boolean;
    selectedGroups: string[];
    selectedUsers: string[];
    setNewUsers: (newUsers: string[]) => void;
    setSelectedUsers: (selectedUsers: string[]) => void;
    setRecipientsOnlyShowSelected: ChangeEventHandler<HTMLInputElement>;
    infobox?: JSX.Element;
    isStarterAdmin?: boolean;
}
interface DialogActions {
    children: string;
    onClick: () => void;
    props?: {
        disabled: boolean;
    };
}
interface Props extends SharingRecipientsDialogProps {
    headingTitle: string;
    emailQueryErrorKey?: string;
    collectionPermissionInfoKey?: string;
    allowNewContacts?: boolean;
    isEditorManagerRoleEnabled?: boolean;
    users: any;
    dialogPrimaryAction: DialogActions;
    dialogSecondaryAction?: DialogActions;
}
export const SharingRecipientsDialog = ({ headingTitle, allowNewContacts = false, emailQueryErrorKey, collectionPermissionInfoKey, users, dialogPrimaryAction, dialogSecondaryAction, isEditorManagerRoleEnabled = false, newUsers, recipientsOnlyShowSelected, selectedGroups, selectedUsers, setNewUsers, setSelectedUsers, setRecipientsOnlyShowSelected, infobox, isStarterAdmin, ...rest }: Props) => {
    const { translate } = useTranslate();
    const groups = useAcceptedUserGroups();
    const { currentSpaceId } = useTeamSpaceContext();
    const [query, setQuery] = useState('');
    const listRef = useRef<FixedSizeList>(null);
    const search = (event: React.ChangeEvent<HTMLInputElement>) => setQuery(event.currentTarget.value);
    const addNewContact = (): void => {
        const sanitizedQuery = sanitizeEmail(query);
        setQuery('');
        setSelectedUsers([sanitizedQuery, ...selectedUsers]);
        setNewUsers(sortUsers([sanitizedQuery, ...newUsers]));
        requestAnimationFrame(() => {
            const recreatedUsersList = [
                ...users,
                ...sortUsers([sanitizedQuery, ...newUsers]).map((newUser) => ({
                    id: newUser,
                    itemCount: 0,
                })),
            ];
            const newItemIndex = groups.length +
                recreatedUsersList.findIndex(({ id }) => id === sanitizedQuery);
            listRef.current?.scrollToItem(newItemIndex);
        });
    };
    const userRequest = useSharingUsers('descend', currentSpaceId);
    if (userRequest.status !== DataStatus.Success) {
        return <IndeterminateLoader color="ds.text.brand.standard"/>;
    }
    const usersList = [
        ...users,
        ...newUsers.map((newUser) => ({ id: newUser, itemCount: 0 })),
    ];
    const hasSelection = selectedGroups.length > 0 || selectedUsers.length > 0;
    const displayCheckbox = hasSelection || recipientsOnlyShowSelected;
    const queriedGroups = getGroupsFilteredByQuery(groups, query);
    const queriedUsers = getUsersFilteredByQuery(usersList, query);
    const hasNoResults = queriedUsers.length === 0 && queriedGroups.length === 0;
    const showEmailQueryError = query.length > 0 && hasNoResults && !allowNewContacts && emailQueryErrorKey;
    const showSelectedInfo = !showEmailQueryError;
    return (<>
      <Heading as="h1" sx={{ mb: '16px' }}>
        {translate(headingTitle)}
      </Heading>
      <DialogBody>
        <div sx={{ height: 'auto', width: '640px' }}>
          {showSelectedInfo &&
            collectionPermissionInfoKey &&
            !isEditorManagerRoleEnabled ? (<Paragraph textStyle="ds.body.standard.regular" sx={{ mb: '16px' }}>
              {translate(collectionPermissionInfoKey)}
            </Paragraph>) : null}
          <section role="search" sx={{ mb: '16px' }}>
            <SearchField value={query} onChange={search} label={translate(I18N_KEYS.PLACEHOLDER)} aria-label={translate(I18N_KEYS.PLACEHOLDER)} placeholder={translate(I18N_KEYS.PLACEHOLDER)} autoFocus error={!!showEmailQueryError} feedback={showEmailQueryError
            ? {
                text: translate(emailQueryErrorKey),
            }
            : undefined}/>
          </section>
          <RecipientsList addNewContact={addNewContact} query={query} recipientsOnlyShowSelected={recipientsOnlyShowSelected} selectedGroups={selectedGroups} selectedUsers={selectedUsers} users={usersList} ref={listRef} allowNewContacts={allowNewContacts} isStarterAdmin={isStarterAdmin} {...rest}/>
          {infobox ? infobox : null}
        </div>
      </DialogBody>
      <DialogFooter primaryButtonOnClick={dialogPrimaryAction.onClick} primaryButtonTitle={translate(dialogPrimaryAction.children)} primaryButtonProps={{
            ...dialogPrimaryAction.props,
            type: 'button',
        }} secondaryButtonOnClick={dialogSecondaryAction ? dialogSecondaryAction.onClick : undefined} secondaryButtonTitle={dialogSecondaryAction
            ? translate(dialogSecondaryAction.children)
            : undefined} secondaryButtonProps={dialogSecondaryAction ? dialogSecondaryAction.props : undefined}>
        {displayCheckbox && (<Checkbox checked={recipientsOnlyShowSelected} onChange={setRecipientsOnlyShowSelected} label={translate(I18N_KEYS.SHOW_SELECTED)} sx={{ ml: '0', mr: 'auto', pr: '16px' }}/>)}
      </DialogFooter>
    </>);
};
