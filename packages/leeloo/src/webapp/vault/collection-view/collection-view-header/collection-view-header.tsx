import { Fragment, useState } from 'react';
import { Heading, jsx } from '@dashlane/design-system';
import { ShareableCollection } from '@dashlane/sharing-contracts';
import { SpaceAndSharingIconsRow } from 'webapp/components/space-and-sharing-icons/space-and-sharing-icons-row';
import { Header } from 'webapp/components/header/header';
import { AccountMenuAndBellNotifications } from './account-menu-and-bell-notifications';
import { DeleteButton } from './delete-button';
import { EditButton } from './edit-button';
import { SharedAccessButton } from './shared-access-button';
import { ShareCollectionButton } from './share-collection-button';
type Props = Omit<ShareableCollection, 'vaultItems'> & {
    isPersonalSpaceDisabled: boolean;
};
export const CollectionViewHeader = ({ isShared = false, isPersonalSpaceDisabled, ...collection }: Props) => {
    const [isSharedAccessDialogOpen, setIsSharedAccessDialogOpen] = useState(false);
    return (<Header sx={{ marginRight: '16px' }} startWidgets={() => (<SpaceAndSharingIconsRow isShared={isShared} spaceId={isPersonalSpaceDisabled ? undefined : collection.spaceId}>
          <Heading as="h1" textStyle="ds.title.section.large" style={{
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
            }}>
            {collection.name}
          </Heading>
        </SpaceAndSharingIconsRow>)} endWidget={<>
          {collection?.spaceId ? (<ShareCollectionButton id={collection.id}/>) : null}
          {isShared ? (<SharedAccessButton id={collection.id} isSharedAccessDialogOpen={isSharedAccessDialogOpen} setIsSharedAccessDialogOpen={setIsSharedAccessDialogOpen}/>) : null}
          <EditButton isShared={isShared} {...collection}/>
          <DeleteButton isShared={isShared} id={collection.id} name={collection.name} setIsSharedAccessDialogOpen={setIsSharedAccessDialogOpen}/>
          {AccountMenuAndBellNotifications}
        </>}/>);
};
