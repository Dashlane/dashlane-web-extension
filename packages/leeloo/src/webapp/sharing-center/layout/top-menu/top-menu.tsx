import * as React from 'react';
import { Origin } from '@dashlane/hermes';
import { Permission } from '@dashlane/sharing-contracts';
import { Connected as NotificationsDropdown } from 'webapp/bell-notifications/connected';
import { Header } from 'webapp/components/header/header';
import { HeaderAccountMenu } from 'webapp/components/header/header-account-menu';
import { SharingButton } from 'webapp/sharing-invite/sharing-button';
import { ItemsTabs, SharingInviteStep } from 'webapp/sharing-invite/types';
const headerStartWidgets = () => (<SharingButton sharing={{
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
    }} origin={Origin.ItemListView}/>);
const headerEndWidgets = (<>
    <HeaderAccountMenu />
    <NotificationsDropdown />
  </>);
export const TopMenu = () => {
    return (<Header startWidgets={headerStartWidgets} endWidget={headerEndWidgets}/>);
};
