import { Fragment } from 'react';
import { colors, FlexChild, FlexContainer, LoadingIcon, } from '@dashlane/ui-components';
import { Maybe } from 'tsmonad';
import { Heading, jsx, mergeSx, ThemeUIStyleObject, } from '@dashlane/design-system';
import { DataStatus } from '@dashlane/carbon-api-consumers';
import { useFeatureFlip } from '@dashlane/framework-react';
import { FEATURE_FLIPS_WITHOUT_MODULE } from '@dashlane/framework-dashlane-application';
import { Lee } from 'lee';
import { usePremiumStatus } from 'libs/carbon/hooks/usePremiumStatus';
import useTranslate from 'libs/i18n/useTranslate';
import { useDiscontinuedStatus, useNodePremiumStatus, } from 'libs/carbon/hooks/useNodePremiumStatus';
import { useTeamCancellationStatus } from 'libs/hooks/use-team-cancellation-status';
import { HorizontalRule } from 'team/change-plan/components/HorizontalRule';
import { VatNumber } from 'team/change-plan/content/vat-number/vat-number';
import { useBillingCountry } from 'team/helpers/useBillingCountry';
import { CancelSubscriptionFlow } from '../cancelation/cancel-subscription-flow';
import { SX_ACCOUNT_STYLES } from '../account.styles';
import { BillingAdmin } from './admin/billing-admin';
import { InvoicePaymentMethodPlan } from './invoice-payment-method/invoice-payment-method-plan';
import { InvoicePaymentMethodSeats } from './invoice-payment-method/invoice-payment-method-seats';
import { PaymentMethod } from './payment-method/payment-method';
import { SubscriptionDateCard } from './subscription-date/subscription-date-card';
import { DownGradeMessage } from '../downgrade/downgrade-message';
const I18N_KEYS = {
    BILLING_HEADING: 'team_account_heading_billing_information',
};
const SX_STYLES: ThemeUIStyleObject = {
    backgroundColor: 'ds.container.agnostic.neutral.supershy',
    padding: '32px',
    flex: '1',
    overflow: 'visible',
};
interface Props {
    lee: Lee;
    planName: Maybe<string>;
    usersToBeRenewedCount: number;
    isWindowCollapsed: boolean;
    handleGetPastReceipts: () => void;
    onRequestTeamUpgrade: () => void;
}
export const BillingInformation = ({ lee, planName, usersToBeRenewedCount, isWindowCollapsed, handleGetPastReceipts, onRequestTeamUpgrade, }: Props) => {
    const { translate } = useTranslate();
    const premiumStatus = usePremiumStatus();
    const nodePremiumStatus = useNodePremiumStatus();
    const discontinuedStatus = useDiscontinuedStatus();
    const { loading, billingCountry } = useBillingCountry();
    const cancelSubscriptionStatus = useTeamCancellationStatus();
    const isDisabled = planName.caseOf({
        just: () => false,
        nothing: () => true,
    });
    const hasCancelSubscriptionFF = useFeatureFlip(FEATURE_FLIPS_WITHOUT_MODULE.EcommerceWebSadPathDev);
    const hasEcommDiscontinuationFF = useFeatureFlip(FEATURE_FLIPS_WITHOUT_MODULE.EcommerceWebB2BDiscontinuationPhase1);
    if (premiumStatus.status !== DataStatus.Success ||
        !premiumStatus.data ||
        nodePremiumStatus.status !== DataStatus.Success ||
        !nodePremiumStatus.data ||
        !cancelSubscriptionStatus ||
        discontinuedStatus.isLoading ||
        loading) {
        return <LoadingIcon color={colors.midGreen00}/>;
    }
    const isRenewalStopped = nodePremiumStatus.data.b2bStatus?.currentTeam?.isRenewalStopped;
    const hasInvoicePlanType = premiumStatus.data.planType === 'invoice';
    const shouldShowVatNumber = !hasInvoicePlanType && billingCountry !== 'US';
    const isDiscontinuedTrial = discontinuedStatus.isTrial && discontinuedStatus.isTeamSoftDiscontinued;
    const shouldShowDowngradeMessage = hasEcommDiscontinuationFF && isDiscontinuedTrial;
    return (<FlexContainer flexDirection="column">
      <Heading textStyle="ds.title.section.large" as="h1" color="ds.text.neutral.standard" sx={{ mb: '32px' }}>
        {translate(I18N_KEYS.BILLING_HEADING)}
      </Heading>
      <FlexContainer gap="24px">
        <FlexContainer flexDirection="column" sx={{ maxWidth: '40em' }}>
          <FlexContainer sx={mergeSx([SX_ACCOUNT_STYLES.CARD_BORDER, SX_STYLES])} flexDirection={'column'}>
            <BillingAdmin lee={lee}/>
            <HorizontalRule />
            {hasInvoicePlanType ? (<>
                <InvoicePaymentMethodPlan />
                <HorizontalRule />
                <InvoicePaymentMethodSeats isDisabled={isDisabled}/>
              </>) : (<PaymentMethod isDisabled={isDisabled}/>)}
            {shouldShowVatNumber ? (<>
                <div sx={{ marginBottom: '16px' }}/>
                <HorizontalRule />
                <VatNumber isInAccountSummary/>
              </>) : null}
          </FlexContainer>
        </FlexContainer>
        <FlexChild sx={{
            width: isWindowCollapsed ? '40em' : '416px',
        }}>
          <SubscriptionDateCard onClickBuyDashlane={onRequestTeamUpgrade} handleGetPastReceipts={handleGetPastReceipts} usersToBeRenewedCount={usersToBeRenewedCount} isRenewalStopped={isRenewalStopped} discontinuedTrial={!!shouldShowDowngradeMessage}/>
        </FlexChild>
        <FlexContainer flexDirection="column" sx={{ maxWidth: '40em' }}>
          {shouldShowDowngradeMessage ? (<DownGradeMessage />) : hasCancelSubscriptionFF ? (<CancelSubscriptionFlow status={cancelSubscriptionStatus}/>) : null}
        </FlexContainer>
      </FlexContainer>
    </FlexContainer>);
};
