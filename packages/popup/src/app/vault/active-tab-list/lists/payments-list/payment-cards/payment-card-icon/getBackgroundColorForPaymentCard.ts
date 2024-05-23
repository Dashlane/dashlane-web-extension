import color from 'color';
import { colors } from '@dashlane/ui-components';
import { PaymentCardColorType } from '@dashlane/vault-contracts';
const CARD_COLORS: {
    [k in PaymentCardColorType | 'fallback']: string;
} = {
    fallback: '#000000',
    BLACK: '#191919',
    SILVER: '#A6A6A6',
    WHITE: '#F5F5F5',
    RED: '#BD0505',
    ORANGE: '#F29100',
    GOLD: '#DFC279',
    BLUE1: '#3290CC',
    BLUE2: '#105079',
    GREEN1: '#008E28',
    GREEN2: '#39725E',
};
export const getBackgroundColorForPaymentCard = (paymentCardColor: PaymentCardColorType | 'fallback' = 'fallback') => {
    const backgroundColor = CARD_COLORS[paymentCardColor];
    const contrast = color(backgroundColor).contrast(color('white'));
    return contrast < 1.1 ? colors.dashGreen00 : backgroundColor;
};
