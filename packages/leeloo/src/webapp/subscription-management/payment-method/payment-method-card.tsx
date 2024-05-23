import { useState } from 'react';
import { Card, colors, Heading, Paragraph, ThemeUIStyleObject, } from '@dashlane/ui-components';
import { IndeterminateLoader, jsx } from '@dashlane/design-system';
import { DataStatus } from '@dashlane/carbon-api-consumers';
import { usePremiumStatus } from 'libs/carbon/hooks/usePremiumStatus';
import useTranslate from 'libs/i18n/useTranslate';
import { useCreditCardPaymentMethodDisplay } from 'team/account/upgrade-success/useCreditCardPaymentDisplay';
import { PaymentMethodDetails } from './payment-method-details';
const I18N_KEYS = {
    CARD_TITLE: 'manage_subscription_payment_section_title',
    TEXT_NO_PAYMENT_METHOD_SAVED: 'manage_subscription_payment_section_no_payment',
};
interface Props {
    b2b?: boolean;
    hideTitle?: boolean;
    hideUpdateButton?: boolean;
    displayModifiedCreditCardView?: boolean;
    styles?: ThemeUIStyleObject;
}
export const PaymentMethodCard = ({ b2b, hideTitle, hideUpdateButton, displayModifiedCreditCardView, styles, }: Props) => {
    const { translate } = useTranslate();
    const { loading, billingInformation } = useCreditCardPaymentMethodDisplay({
        b2c: !b2b,
    });
    const premiumStatus = usePremiumStatus();
    const [paymentLoading, setPaymentLoading] = useState(false);
    if (premiumStatus.status !== DataStatus.Success ||
        !premiumStatus.data ||
        loading) {
        return <IndeterminateLoader />;
    }
    const isAppStoreUser = premiumStatus.data?.planType?.includes('ios') ?? false;
    const isGooglePlayUser = premiumStatus.data?.planType?.includes('playstore') ?? false;
    const hasPaymentMethod = billingInformation?.last4 || isAppStoreUser || isGooglePlayUser;
    return (<Card sx={styles}>
      {hideTitle ? null : (<Heading size="small" as="h2">
          {translate(I18N_KEYS.CARD_TITLE)}
        </Heading>)}
      {hasPaymentMethod ? (<PaymentMethodDetails b2c={!b2b} displayModifiedCreditCardView={displayModifiedCreditCardView} hideUpdateButton={hideUpdateButton} isAppStoreUser={isAppStoreUser} isGooglePlayUser={isGooglePlayUser} paymentLoading={paymentLoading} premiumStatusData={premiumStatus.data} setPaymentLoading={setPaymentLoading}/>) : (<div sx={{ marginTop: '8px' }}>
          <Paragraph color={colors.grey00}>
            {translate(I18N_KEYS.TEXT_NO_PAYMENT_METHOD_SAVED)}
          </Paragraph>
        </div>)}
    </Card>);
};
