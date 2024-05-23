import * as React from 'react';
import { colors, LoadingIcon } from '@dashlane/ui-components';
import { Button, Heading, Icon, jsx, Paragraph } from '@dashlane/design-system';
import { DataStatus } from '@dashlane/carbon-api-consumers';
import useTranslate from 'libs/i18n/useTranslate';
import { usePremiumStatus } from 'libs/carbon/hooks/usePremiumStatus';
import { PaymentLoading } from 'libs/billing/PaymentLoading';
import { logUserUpdatePaymentMethodEvent } from 'webapp/subscription-management/logs';
import setupStyles from '../../setup/style/index.css';
import styles from './payment-method.css';
import { useCreditCardPaymentMethodDisplay } from 'team/account/upgrade-success/useCreditCardPaymentDisplay';
export interface Props {
    isDisabled?: boolean;
}
export const PaymentMethod = ({ isDisabled }: Props) => {
    const [paymentLoading, setPaymentLoading] = React.useState(false);
    const { translate } = useTranslate();
    const premiumStatus = usePremiumStatus();
    const { loading, billingInformation, last4DigitsFormatted, cardSvg, isExpired, expFormatted, pollUntilCardUpdate, } = useCreditCardPaymentMethodDisplay({});
    if (premiumStatus.status !== DataStatus.Success ||
        !premiumStatus.data ||
        loading) {
        return <LoadingIcon color={colors.midGreen00}/>;
    }
    const AddCreditCardButton = () => {
        return (<div>
        <Button mood="neutral" intensity="quiet" icon={<Icon name="ActionAddOutlined"/>} layout="iconLeading" onClick={() => {
                pollUntilCardUpdate();
                setPaymentLoading(true);
            }} sx={{ marginTop: '1em' }}>
          {paymentLoading ? (<PaymentLoading b2c={false} setPaymentLoading={setPaymentLoading}/>) : (translate('team_account_payment_add_credit_card'))}
        </Button>
      </div>);
    };
    return (<div style={{ marginTop: '24px' }}>
      <Heading color="ds.text.neutral.catchy" as="h2" textStyle="ds.title.section.medium">
        {translate('team_account_paymentmethod_heading')}
      </Heading>
      {billingInformation?.billingType ? (last4DigitsFormatted ? (<div className={styles.container}>
            <div className={setupStyles.col1}>
              <div className={styles.billing}>
                <div className={styles.billing}>
                  {cardSvg}
                  <Paragraph color="ds.text.neutral.standard">
                    <span style={{ marginLeft: '10px' }}>••••</span>
                    <span data-testid="card-last-four" style={{ marginLeft: '3px' }}>
                      {last4DigitsFormatted}
                    </span>
                  </Paragraph>
                </div>
              </div>
              {isExpired ? (<Paragraph color="ds.text.danger.standard" sx={{ marginBottom: '8px', fontSize: 14 }}>
                  {translate('manage_subscription_payment_section_expired_stripe')}
                </Paragraph>) : (<Paragraph color="ds.text.neutral.standard" sx={{ marginBottom: '8px' }}>
                  {expFormatted
                    ? translate('manage_subscription_payment_section_expiration_date', {
                        date: expFormatted,
                    })
                    : null}
                </Paragraph>)}
            </div>
            <div className={setupStyles.col2}>
              <Button mood="neutral" intensity="quiet" icon={<Icon name="ActionEditOutlined"/>} layout="iconLeading" onClick={() => {
                pollUntilCardUpdate();
                setPaymentLoading(true);
                logUserUpdatePaymentMethodEvent(premiumStatus.data);
            }} disabled={isDisabled}>
                {paymentLoading ? (<PaymentLoading b2c={false} setPaymentLoading={setPaymentLoading}/>) : (translate('team_account_payment_edit_credit_card'))}
              </Button>
            </div>
          </div>) : (<div sx={{ margin: '16px 0 24px' }}>
            <div>
              <Paragraph color="ds.text.neutral.quiet" textStyle="ds.body.standard.regular">
                {translate('team_account_paymentmethod_payment_method_unknow')}
              </Paragraph>
            </div>
            <AddCreditCardButton />
          </div>)) : (<div sx={{ margin: '16px 0 24px' }}>
          <div>
            <Paragraph color="ds.text.neutral.quiet" textStyle="ds.body.standard.regular">
              {translate('team_account_paymentmethod_no_payment_method')}
            </Paragraph>
          </div>
          <AddCreditCardButton />
        </div>)}
    </div>);
};
