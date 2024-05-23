import { Dispatch, Fragment, SetStateAction } from 'react';
import { colors, FlexContainer, jsx, OpenWebsiteIcon, Paragraph, } from '@dashlane/ui-components';
import { Button } from '@dashlane/design-system';
import { PremiumStatus } from '@dashlane/communication';
import { APP_STORE_BILL_HISTORY, GOOGLE_PLAY_BILL_HISTORY, } from 'app/routes/constants';
import useTranslate from 'libs/i18n/useTranslate';
import { PaymentLoading } from 'libs/billing/PaymentLoading';
import { openDashlaneUrl } from 'libs/external-urls';
import { useCreditCardPaymentMethodDisplay } from 'team/account/upgrade-success/useCreditCardPaymentDisplay';
import { logUserUpdatePaymentMethodEvent } from 'webapp/subscription-management/logs';
const I18N_KEYS = {
    APPLE_MANAGE_PAYMENT: 'manage_subscription_payment_section_desc_apple',
    BUTTON_LEARN_MORE: 'manage_subscription_learn_more_button',
    BUTTON_UPDATE_PAYMENT: 'manage_subscription_payment_section_update_details',
    EXPIRATION_DATE: 'manage_subscription_payment_section_expiration_date',
    EXPIRATION_MESSAGE: 'manage_subscription_payment_section_expired_stripe',
    GOOGLE_MANAGE_PAYMENT: 'manage_subscription_payment_section_desc_google',
};
interface Props {
    b2c: boolean;
    displayModifiedCreditCardView: boolean | undefined;
    hideUpdateButton: boolean | undefined;
    isAppStoreUser: boolean;
    isGooglePlayUser: boolean;
    paymentLoading: boolean;
    premiumStatusData: PremiumStatus;
    setPaymentLoading: Dispatch<SetStateAction<boolean>>;
}
export const PaymentMethodDetails = ({ b2c, displayModifiedCreditCardView, hideUpdateButton, isAppStoreUser, isGooglePlayUser, paymentLoading, premiumStatusData, setPaymentLoading, }: Props) => {
    const { translate } = useTranslate();
    const { last4DigitsFormatted, cardSvg, isExpired, expFormatted, pollUntilCardUpdate, } = useCreditCardPaymentMethodDisplay({ b2c });
    const storeDescriptionText = isAppStoreUser
        ? I18N_KEYS.APPLE_MANAGE_PAYMENT
        : I18N_KEYS.GOOGLE_MANAGE_PAYMENT;
    const expirationDate = expFormatted
        ? translate(I18N_KEYS.EXPIRATION_DATE, {
            date: expFormatted,
        })
        : null;
    const handleClickUpdate = () => {
        pollUntilCardUpdate();
        setPaymentLoading(true);
        logUserUpdatePaymentMethodEvent(premiumStatusData);
    };
    const goGetOutsideSupport = () => {
        openDashlaneUrl(isAppStoreUser ? APP_STORE_BILL_HISTORY : GOOGLE_PLAY_BILL_HISTORY, {
            type: 'checkout',
            action: 'goToPayment',
        });
    };
    return (<div sx={{ marginTop: '20px' }}>
      {isAppStoreUser || isGooglePlayUser ? (<>
          <Paragraph color={colors.grey00}>
            {translate(storeDescriptionText)}
          </Paragraph>
          <Button mood="neutral" intensity="supershy" onClick={goGetOutsideSupport} sx={{ marginTop: '20px' }}>
            {translate(I18N_KEYS.BUTTON_LEARN_MORE)}
            <OpenWebsiteIcon color={colors.dashGreen01} sx={{ marginLeft: '8px' }}/>
          </Button>
        </>) : (<>
          {displayModifiedCreditCardView ? (<FlexContainer sx={{
                    marginBottom: '16px',
                    alignItems: 'center',
                    color: 'ds.text.neutral.standard',
                }}>
              {cardSvg}
              <div>
                <Paragraph color="ds.text.neutral.standard" bold>
                  <span sx={{ marginLeft: '10px' }}>••••</span>
                  <span data-testid="card-last-four" sx={{ marginLeft: '3px' }}>
                    {last4DigitsFormatted}
                  </span>
                </Paragraph>
                {isExpired ? (<Paragraph size="small" color={colors.red00} sx={{ margin: '4px 0 0 10px' }}>
                    {translate(I18N_KEYS.EXPIRATION_MESSAGE)}
                  </Paragraph>) : (<Paragraph size="small" color="ds.text.neutral.quiet" sx={{ margin: '4px 0 0 10px' }}>
                    {expirationDate}
                  </Paragraph>)}
              </div>
            </FlexContainer>) : (<>
              <FlexContainer sx={{ marginBottom: '8px', alignItems: 'center' }}>
                {cardSvg}
                <Paragraph color={colors.grey00}>
                  <span sx={{ marginLeft: '10px' }}>••••</span>
                  <span data-testid="card-last-four" sx={{ marginLeft: '3px' }}>
                    {last4DigitsFormatted}
                  </span>
                </Paragraph>
              </FlexContainer>

              {isExpired ? (<Paragraph color={colors.red00} sx={{ marginBottom: '8px', fontSize: 14 }}>
                  {translate(I18N_KEYS.EXPIRATION_MESSAGE)}
                </Paragraph>) : (<Paragraph color={colors.grey00} sx={{ marginBottom: '8px' }}>
                  {expirationDate}
                </Paragraph>)}
            </>)}
          {hideUpdateButton ? null : (<Button intensity="quiet" onClick={handleClickUpdate} isLoading={paymentLoading}>
              {paymentLoading ? (<PaymentLoading b2c={true} setPaymentLoading={setPaymentLoading}/>) : (translate(I18N_KEYS.BUTTON_UPDATE_PAYMENT))}
            </Button>)}
        </>)}
    </div>);
};
