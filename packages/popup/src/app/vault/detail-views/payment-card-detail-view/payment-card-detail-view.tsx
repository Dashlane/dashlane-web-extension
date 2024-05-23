import React, { memo, useEffect } from 'react';
import { DataStatus, useModuleQuery } from '@dashlane/framework-react';
import { vaultItemsCrudApi, VaultItemType } from '@dashlane/vault-contracts';
import { PageView } from '@dashlane/hermes';
import { logPageView } from 'src/libs/logs/logEvent';
import { PaymentCardDetailHeader } from './payment-card-detail-header';
import { PaymentCardDetailForm } from './payment-card-detail-form';
interface PaymentCardDetailViewComponentProps {
    onClose: () => void;
    itemId: string;
}
const PaymentCardDetailViewComponent = ({ onClose, itemId, }: PaymentCardDetailViewComponentProps) => {
    const { status, data } = useModuleQuery(vaultItemsCrudApi, 'query', {
        vaultItemTypes: [VaultItemType.PaymentCard],
        ids: [itemId],
    });
    useEffect(() => {
        logPageView(PageView.ItemCreditCardDetails);
    }, []);
    if (status !== DataStatus.Success || !data.paymentCardsResult.items.length) {
        return null;
    }
    const card = data.paymentCardsResult.items[0];
    return (<>
      <PaymentCardDetailHeader card={card} onClose={onClose}/>
      <PaymentCardDetailForm card={card}/>
    </>);
};
export const PaymentCardDetailView = memo(PaymentCardDetailViewComponent);
