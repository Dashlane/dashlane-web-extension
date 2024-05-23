import { Fragment, useState } from 'react';
import { Button, Icon } from '@dashlane/design-system';
import { colors, FlexContainer, GridChild, GridContainer, jsx, LoadingIcon, Paragraph, } from '@dashlane/ui-components';
import useTranslate from 'libs/i18n/useTranslate';
import { PaymentLoading } from 'libs/billing/PaymentLoading';
import { useCreditCardPaymentMethodDisplay } from 'team/account/upgrade-success/useCreditCardPaymentDisplay';
import { logEvent } from 'libs/logs/logEvent';
import { FlowStep, UserAddNewPaymentMethodEvent } from '@dashlane/hermes';
interface Props {
    isDisabled?: boolean;
}
export const InvoicePaymentMethodSeats = ({ isDisabled }: Props) => {
    const [paymentLoading, setPaymentLoading] = useState(false);
    const { translate } = useTranslate();
    const { loading, hasCreditCardPaymentMethod, last4DigitsFormatted, cardSvg, isExpired, expFormatted, pollUntilCardUpdate, } = useCreditCardPaymentMethodDisplay({
        handleCardUpdate: (isNewCard) => {
            if (isNewCard) {
                logEvent(new UserAddNewPaymentMethodEvent({
                    flowStep: FlowStep.Complete,
                }));
            }
        },
    });
    if (loading) {
        return <LoadingIcon color={colors.midGreen00}/>;
    }
    return (<FlexContainer gap="16px" sx={{ marginTop: '24px' }}>
      <Paragraph color="ds.text.neutral.catchy" as="h2" size="large">
        {translate('team_account_invoice_payment_seats_heading')}
      </Paragraph>
      {hasCreditCardPaymentMethod ? (<GridContainer gridTemplateColumns="1fr 1fr" sx={{ width: '100%' }}>
          <GridChild sx={{ width: '300px' }}>
            <Paragraph color="ds.text.neutral.standard" sx={{ display: 'flex', alignItems: 'center' }}>
              {cardSvg}
              <span style={{ marginLeft: '10px' }}>••••</span>
              <span data-testid="card-last-four" style={{ marginLeft: '3px' }}>
                {last4DigitsFormatted}
              </span>
            </Paragraph>
            {isExpired ? (<Paragraph color={colors.red00} sx={{ marginTop: '8px', fontSize: 14 }}>
                {translate('manage_subscription_payment_section_expired_stripe')}
              </Paragraph>) : (<Paragraph color="ds.text.neutral.standard" sx={{ marginTop: '8px' }}>
                {expFormatted
                    ? translate('manage_subscription_payment_section_expiration_date', {
                        date: expFormatted,
                    })
                    : null}
              </Paragraph>)}
          </GridChild>
          <GridChild alignSelf="center">
            <Button mood="neutral" intensity="quiet" icon={<Icon name="ActionEditOutlined"/>} layout="iconLeading" onClick={() => {
                pollUntilCardUpdate();
                setPaymentLoading(true);
            }} disabled={isDisabled}>
              {paymentLoading ? (<PaymentLoading b2c={false} setPaymentLoading={setPaymentLoading}/>) : (translate('team_account_payment_edit_credit_card'))}
            </Button>
          </GridChild>
        </GridContainer>) : (<>
          <div>
            <Paragraph color="ds.text.neutral.quiet" size="small">
              {translate('team_account_invoice_payment_seats_save_credit_card')}
            </Paragraph>
            <Paragraph color="ds.text.neutral.quiet" size="small">
              {translate('team_account_invoice_payment_seats_subscription')}
            </Paragraph>
          </div>
          <div>
            <Button mood="neutral" intensity="quiet" onClick={() => {
                logEvent(new UserAddNewPaymentMethodEvent({
                    flowStep: FlowStep.Start,
                }));
                pollUntilCardUpdate();
                setPaymentLoading(true);
            }}>
              {paymentLoading ? (<PaymentLoading b2c={false} setPaymentLoading={setPaymentLoading}/>) : (translate('team_account_payment_add_credit_card'))}
            </Button>
          </div>
        </>)}
    </FlexContainer>);
};
