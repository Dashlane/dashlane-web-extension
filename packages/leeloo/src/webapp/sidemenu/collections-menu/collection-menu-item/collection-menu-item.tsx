import React from 'react';
import { CollectionSelectOrigin, UserSelectCollectionEvent, } from '@dashlane/hermes';
import { ShareableCollection } from '@dashlane/sharing-contracts';
import { logEvent } from 'libs/logs/logEvent';
import { useRouterGlobalSettingsContext } from 'libs/router';
import { MenuItem } from '../../menu-item';
import { MenuItemContent } from './menu-item-content';
import { ActionsMenu } from '../actions-menu';
interface Props {
    collection: ShareableCollection;
    isPersonalSpaceDisabled: boolean;
}
export const CollectionMenuItem = ({ collection, isPersonalSpaceDisabled, }: Props) => {
    const { routes } = useRouterGlobalSettingsContext();
    return (<MenuItem onClick={() => logEvent(new UserSelectCollectionEvent({
            collectionId: collection.id,
            collectionSelectOrigin: CollectionSelectOrigin.LeftHandSideMenu,
        }))} to={routes.userCollection(collection.id)} threeDotsComponent={<ActionsMenu collection={collection}/>}>
      <MenuItemContent collectionName={collection.name} collectionSpaceId={collection.spaceId} isPersonalSpaceDisabled={isPersonalSpaceDisabled} isShared={!!collection.isShared}/>
    </MenuItem>);
};
