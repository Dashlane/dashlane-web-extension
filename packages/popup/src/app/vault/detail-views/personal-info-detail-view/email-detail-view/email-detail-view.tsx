import React, { memo, useEffect } from 'react';
import { PageView } from '@dashlane/hermes';
import { DataStatus, useModuleQuery } from '@dashlane/framework-react';
import { vaultItemsCrudApi, VaultItemType } from '@dashlane/vault-contracts';
import { logPageView } from 'src/libs/logs/logEvent';
import { EmailDetailHeader } from './email-detail-header';
import { EmailDetailForm } from './email-detail-form';
interface EmailDetailViewComponentProps {
    onClose: () => void;
    itemId: string;
}
const EmailDetailViewComponent = ({ onClose, itemId, }: EmailDetailViewComponentProps) => {
    const { status, data } = useModuleQuery(vaultItemsCrudApi, 'query', {
        vaultItemTypes: [VaultItemType.Email],
        ids: [itemId],
    });
    useEffect(() => {
        logPageView(PageView.ItemEmailDetails);
    }, []);
    if (status !== DataStatus.Success || !data.emailsResult.items.length) {
        return null;
    }
    const email = data.emailsResult.items[0];
    return (<>
      <EmailDetailHeader name={email.itemName} id={email.id} onClose={onClose}/>
      <EmailDetailForm email={email}/>
    </>);
};
export const EmailDetailView = memo(EmailDetailViewComponent);
