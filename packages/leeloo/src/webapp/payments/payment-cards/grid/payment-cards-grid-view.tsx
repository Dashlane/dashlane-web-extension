import { Heading, jsx } from '@dashlane/design-system';
import { Fragment, memo } from 'react';
import { ItemsQueryResult, PaymentCard } from '@dashlane/vault-contracts';
import { logSelectCreditCard } from 'libs/logs/events/vault/select-item';
import { PaymentCardGridItem } from 'webapp/payments/payment-cards/grid-item/payment-card-grid-item';
import useTranslate from 'libs/i18n/useTranslate';
const I18N_KEYS = {
    PAYMENT_CARD: 'payments_grid_category_payment_card',
};
export interface PaymentCardsGridViewProps {
    paymentCardsResult: ItemsQueryResult<PaymentCard>;
    cardRoute: (uuid: string) => string;
}
const PaymentCardsGridViewComponent = ({ paymentCardsResult, cardRoute, }: PaymentCardsGridViewProps) => {
    const { translate } = useTranslate();
    return (<>
      <Heading as="h2" textStyle="ds.title.supporting.small" color="ds.text.neutral.quiet" sx={{
            borderBottom: '1px solid transparent',
            borderColor: 'ds.border.neutral.quiet.idle',
            marginTop: '24px',
            paddingBottom: '16px',
            userSelect: 'none',
        }}>
        {translate(I18N_KEYS.PAYMENT_CARD)} ({paymentCardsResult.matchCount})
      </Heading>
      <div sx={{
            display: 'flex',
            justifyContent: 'start',
            flexWrap: 'wrap',
            padding: '32px 0',
            gap: '24px',
        }}>
        {paymentCardsResult.items.map((paymentCard) => (<PaymentCardGridItem item={paymentCard} key={paymentCard.id} linkTo={cardRoute} onClick={() => {
                logSelectCreditCard(paymentCard.id);
            }}/>))}
      </div>
    </>);
};
export const PaymentCardsGridView = memo(PaymentCardsGridViewComponent);
