import { PaymentCard, PaymentCardColorType } from '@dashlane/vault-contracts';
import { baseItemView } from './credential';
export const mockPaymentCard: PaymentCard = {
    ...baseItemView,
    cardNumber: '4242 4242 4242 4242',
    color: PaymentCardColorType.Orange,
    expireMonth: '11',
    expireYear: '2042',
    itemName: 'HSBC',
    lastBackupTime: 1692867189530,
    note: '',
    ownerName: 'Peder Dingo',
    securityCode: '999',
};
