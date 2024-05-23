import React, { memo, useEffect } from 'react';
import { PageView } from '@dashlane/hermes';
import { DataStatus, useModuleQuery } from '@dashlane/framework-react';
import { vaultItemsCrudApi, VaultItemType } from '@dashlane/vault-contracts';
import { logPageView } from 'src/libs/logs/logEvent';
import { WebsiteDetailHeader } from './website-header';
import { WebsiteDetailForm } from './website-form';
interface Props {
    onClose: () => void;
    itemId: string;
}
const WebsiteDetailViewComponent = ({ onClose, itemId }: Props) => {
    const { status, data } = useModuleQuery(vaultItemsCrudApi, 'query', {
        vaultItemTypes: [VaultItemType.Website],
        ids: [itemId],
    });
    useEffect(() => {
        logPageView(PageView.ItemWebsiteDetails);
    }, []);
    if (status !== DataStatus.Success || !data.websitesResult.items.length) {
        return null;
    }
    const website = data.websitesResult.items[0];
    return (<>
      <WebsiteDetailHeader name={website.itemName} id={website.id} onClose={onClose}/>
      <WebsiteDetailForm website={website}/>
    </>);
};
export const WebsiteDetailView = memo(WebsiteDetailViewComponent);
