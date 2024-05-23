import { Fragment, useContext, useEffect, useState } from 'react';
import { PlanChangeStep } from '@dashlane/hermes';
import { DataStatus } from '@dashlane/carbon-api-consumers';
import { IndeterminateLoader, jsx } from '@dashlane/design-system';
import { AlertSeverity, FlexChild, FlexContainer, useAlert, } from '@dashlane/ui-components';
import { useModuleQuery } from '@dashlane/framework-react';
import { BillingMethod, Offer, teamPlanDetailsApi, } from '@dashlane/team-admin-contracts';
import { useTeamBillingInformation } from 'libs/hooks/use-team-billing-information';
import { getUrlSearchParams } from 'libs/router';
import useTranslate from 'libs/i18n/useTranslate';
import { PaymentMethodCard } from 'webapp/subscription-management/payment-method/payment-method-card';
import { CreditCardSummary } from 'team/account/upgrade-success/components/credit-card-summary';
import { BackButton } from 'team/change-plan/components/back-button';
import { useBillingCountry } from 'team/helpers/useBillingCountry';
import { NavBarContext } from 'team/page/nav-layout/nav-layout';
import { useTeamOffers } from 'team/hooks/use-team-offers';
import { BillingContact, OrderSuccess, OrderSummary, Plans, Questions, } from './content';
import { CurrentPlan } from './content/current-plan';
import { OrderSummarySuccess } from './content/order-summary-success';
import { PaymentMethodInvoice } from './content/payment-method-invoice';
import { VatNumber } from './content/vat-number/vat-number';
import { useMidCycleTierLogs } from './logs';
import { ChangePlanState, OrderSummaryDataOutput } from './types';
import { isOfferBusinessTier } from './utils';
const I18N_KEYS = {
    ERROR_GENERIC: 'team_account_teamplan_changeplan_error_generic',
};
export const ChangePlan = () => {
    const { translate } = useTranslate();
    const teamOffers = useTeamOffers();
    const billingInformation = useTeamBillingInformation();
    const { setNavBarChildren } = useContext(NavBarContext);
    const { data: teamSeatsData, status: teamSeatsStatus } = useModuleQuery(teamPlanDetailsApi, 'getTeamSeats');
    const [additionalSeats, setAdditionalSeats] = useState(0);
    const [selectedOffer, setSelectedOffer] = useState<Offer>();
    const [email, setEmail] = useState<string>('');
    const [emailValid, setEmailValid] = useState<boolean>(true);
    const [changePlanState, setChangePlanState] = useState<ChangePlanState>(ChangePlanState.FORM);
    const [orderSummaryData, setOrderSummaryData] = useState<OrderSummaryDataOutput>();
    const { alert: errorAlert, show: showError } = useAlert({
        message: translate(I18N_KEYS.ERROR_GENERIC),
        severity: AlertSeverity.ERROR,
        dismissDelay: 40000,
    });
    const currentSeats = (teamSeatsData?.paid ?? 0) + (teamSeatsData?.extraFree ?? 0);
    const { logChangePlanEvent } = useMidCycleTierLogs({
        selectedOffer,
        hasPromo: false,
        currentSeats,
        additionalSeats,
        planChangeStep: PlanChangeStep.SelectPlanTier,
    });
    useEffect(() => {
        setNavBarChildren(<BackButton />);
        return () => {
            setNavBarChildren(null);
        };
    }, []);
    useEffect(() => {
        const plan = getUrlSearchParams().get('plan');
        if (teamOffers && plan === 'business') {
            setSelectedOffer(teamOffers.businessOffer);
        }
    }, [teamOffers]);
    const { loading: isBillingCountryLoading, billingCountry } = useBillingCountry();
    if (isBillingCountryLoading ||
        teamSeatsStatus !== DataStatus.Success ||
        !teamSeatsData ||
        !billingInformation ||
        !teamOffers) {
        return <IndeterminateLoader mood="brand"/>;
    }
    const hasInvoicePaymentMethod = billingInformation.billingType === BillingMethod.Invoice;
    const currency = teamOffers.businessOffer.currency;
    return (<FlexContainer sx={{ margin: '45px', width: '1180px' }}>
      <div style={{
            bottom: '12px',
            position: 'absolute',
            marginLeft: 'auto',
            marginRight: 'auto',
            left: 0,
            right: 0,
            width: '600px',
        }}>
        {errorAlert}
      </div>
      <FlexContainer flexDirection="column" gap="8px">
        {changePlanState === ChangePlanState.FORM ? (<FlexContainer gap="8px">
            <FlexChild sx={{ width: '646px' }}>
              <FlexContainer flexDirection="column" gap="8px">
                <Plans teamOffers={teamOffers} selectedOffer={selectedOffer} handleSelection={(newPlan: Offer) => {
                logChangePlanEvent(newPlan);
                setSelectedOffer(newPlan);
            }}/>
                {hasInvoicePaymentMethod ? (<PaymentMethodInvoice />) : billingCountry !== 'US' ? (<>
                    <PaymentMethodCard b2b hideUpdateButton styles={{ padding: '32px' }}/>
                    <VatNumber isInAccountSummary={false}/>
                    <BillingContact email={email} emailValid={emailValid} setEmail={setEmail} setEmailValid={setEmailValid}/>
                  </>) : (<>
                    <PaymentMethodCard b2b hideUpdateButton styles={{ padding: '32px' }}/>
                    <BillingContact email={email} emailValid={emailValid} setEmail={setEmail} setEmailValid={setEmailValid}/>
                  </>)}
              </FlexContainer>
            </FlexChild>
            <FlexChild sx={{ width: '470px' }}>
              <FlexContainer flexDirection="column" gap="8px">
                <CurrentPlan teamOffers={teamOffers} currentSeats={currentSeats}/>
                <OrderSummary currentSeats={currentSeats} additionalSeats={additionalSeats} currency={currency} selectedOffer={selectedOffer} email={email} emailValid={emailValid} onSuccess={() => {
                setChangePlanState(() => ChangePlanState.SUCCESS);
            }} onError={showError} setAdditionalSeats={setAdditionalSeats} setOrderSummaryData={setOrderSummaryData}/>
                <Questions />
              </FlexContainer>
            </FlexChild>
          </FlexContainer>) : null}

        {changePlanState === ChangePlanState.SUCCESS &&
            orderSummaryData &&
            selectedOffer ? (<FlexContainer sx={{ display: 'flex', flexWrap: 'nowrap', gap: '16px' }}>
            <FlexContainer sx={{
                display: 'flex',
                flexGrow: '2',
                maxWidth: '632px',
                flexDirection: 'column',
            }}>
              <OrderSuccess targetPlan={isOfferBusinessTier(selectedOffer) ? 'business' : 'team'}/>
            </FlexContainer>
            <FlexContainer sx={{
                display: 'flex',
                flexGrow: '1',
                gap: '16px',
                flexDirection: 'column',
            }}>
              <OrderSummarySuccess currency={currency} selectedOffer={selectedOffer} costData={orderSummaryData}/>
              <CreditCardSummary />
            </FlexContainer>
          </FlexContainer>) : null}
      </FlexContainer>
    </FlexContainer>);
};
