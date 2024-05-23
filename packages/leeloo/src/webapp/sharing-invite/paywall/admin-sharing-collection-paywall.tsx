import { useRef } from 'react';
import { FixedSizeList } from 'react-window';
import { Heading, jsx } from '@dashlane/design-system';
import { ClickOrigin } from '@dashlane/hermes';
import useTranslate from 'libs/i18n/useTranslate';
import { useUserLoginStatus } from 'libs/carbon/hooks/useUserLoginStatus';
import { CollectionSharingPaywall } from 'webapp/paywall/paywall/collection-sharing/collection-sharing-paywall';
import { RecipientsList } from '../recipients/recipient-list';
import { CollectionSharingRoles } from '../recipients/sharing-collection-recipients';
import { useSharingTeamLoginsData } from '../hooks/useSharingTeamLogins';
const I18N_KEYS = {
    COLLECTION_RECIPIENTS_TITLE: 'webapp_sharing_invite_collection_recipients_title'
};
export interface SharingCollectionBlockedProps {
    newUsers: string[];
    onCheckGroup: (groupId: string, checked: boolean) => void;
    onCheckUser: (userId: string, checked: boolean) => void;
    onRolesChanged?: (roles: CollectionSharingRoles[]) => void;
    roles?: CollectionSharingRoles[];
    isStarterTeam?: boolean;
}
export const AdminSharingCollectionPaywall = ({ newUsers, isStarterTeam, ...rest }: SharingCollectionBlockedProps) => {
    const { translate } = useTranslate();
    const currentUserLogin = useUserLoginStatus()?.login;
    const teamLogins = useSharingTeamLoginsData();
    const listRef = useRef<FixedSizeList>(null);
    const users = teamLogins
        .filter((login) => login !== currentUserLogin)
        .map((teamLogin) => ({
        id: teamLogin,
        itemCount: 0,
    }));
    const usersList = [
        ...users,
        ...newUsers.map((newUser) => ({ id: newUser, itemCount: 0 })),
    ];
    return (<div sx={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <Heading as="h1">
        {translate(I18N_KEYS.COLLECTION_RECIPIENTS_TITLE)}
      </Heading>

      <div sx={{ height: 'auto', width: '640px' }}>
        <RecipientsList query={''} recipientsOnlyShowSelected={false} selectedGroups={[]} selectedUsers={[]} users={usersList} ref={listRef} allowNewContacts={false} canShareCollection={false} {...rest}/>
        <CollectionSharingPaywall isStarterTeam={isStarterTeam} canShareCollection={false} clickOrigin={ClickOrigin.CollectionsSharingStarterLimitReachedModal}/>
      </div>
    </div>);
};
