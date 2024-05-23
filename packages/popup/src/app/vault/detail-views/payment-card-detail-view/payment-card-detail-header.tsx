import { memo } from 'react';
import { jsx } from '@dashlane/design-system';
import { PaymentCard } from '@dashlane/vault-contracts';
import { PaymentCardIcon } from 'src/app/vault/active-tab-list/lists/payments-list/payment-cards/payment-card-icon/payment-card-icon';
import { openItemInWebapp } from '../helpers';
import { Header } from '../common/header';
interface PaymentCardDetailHeaderProps {
    card: PaymentCard;
    onClose: () => void;
}
const PaymentCardDetailHeaderComponent = ({ card, onClose, }: PaymentCardDetailHeaderProps) => (<Header Icon={<PaymentCardIcon paymentCardColor={card.color}/>} title={card.itemName} onEdit={() => {
        void openItemInWebapp(card.id, '/credit-cards');
    }} onClose={onClose}/>);
export const PaymentCardDetailHeader = memo(PaymentCardDetailHeaderComponent);
