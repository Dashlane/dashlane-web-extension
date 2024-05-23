import React from 'react';
import { Icon } from '@dashlane/design-system';
import { Origin, SharingFlowType, UserSharingStartEvent, } from '@dashlane/hermes';
import useTranslate from 'libs/i18n/useTranslate';
import { logEvent } from 'libs/logs/logEvent';
import { useCollectionsContext } from 'webapp/vault/collections-context';
import { VaultHeaderButton } from 'webapp/components/header/vault-header-button';
import { SharedAccessDialog } from '../dialogs';
interface SharedAccessButtonProps {
    id: string;
    isSharedAccessDialogOpen: boolean;
    setIsSharedAccessDialogOpen: (value: boolean) => void;
}
export const SharedAccessButton = ({ id, isSharedAccessDialogOpen, setIsSharedAccessDialogOpen, }: SharedAccessButtonProps) => {
    const { translate } = useTranslate();
    const { isCollectionsSharingEnabled } = useCollectionsContext();
    if (!isCollectionsSharingEnabled) {
        return null;
    }
    const onSharedButtonClicked = () => {
        logEvent(new UserSharingStartEvent({
            sharingFlowType: SharingFlowType.CollectionSharing,
            collectionId: id,
            origin: Origin.CollectionDetailView,
        }));
        setIsSharedAccessDialogOpen(true);
    };
    return (<>
      <VaultHeaderButton onClick={onSharedButtonClicked} icon={<Icon name="SharedOutlined"/>}>
        {translate('webapp_sharing_collection_access_dialog_title')}
      </VaultHeaderButton>
      {isSharedAccessDialogOpen && (<SharedAccessDialog onClose={() => setIsSharedAccessDialogOpen(false)} id={id}/>)}
    </>);
};
