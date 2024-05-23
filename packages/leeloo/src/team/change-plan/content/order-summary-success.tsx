import React from 'react';
import { format as dateFormatter } from 'date-fns';
import { colors, FlexContainer, Heading, InfoCircleIcon, LoadingIcon, Paragraph, Tooltip, } from '@dashlane/ui-components';
import { Offer } from '@dashlane/team-admin-contracts';
import useTranslate from 'libs/i18n/useTranslate';
import { useBillingCountry } from 'team/helpers/useBillingCountry';
import { OrderSummaryDataOutput } from '../types';
import { Row } from '../components/row';
import { HorizontalRule } from '../components/HorizontalRule';
import { OrderSummaryHeader } from './order-summary/order-summary-header';
interface OrderSummarySuccessProps {
    currency: string | undefined;
    selectedOffer: Offer;
    costData: OrderSummaryDataOutput;
}
export const OrderSummarySuccess = ({ currency, selectedOffer, costData, }: OrderSummarySuccessProps) => {
    const { translate } = useTranslate();
    const { loading, billingCountry } = useBillingCountry();
    if (loading) {
        return <LoadingIcon color={colors.midGreen00}/>;
    }
    const taxCopy = billingCountry === 'US'
        ? 'team_account_teamplan_changeplan_order_summary_tax'
        : 'team_account_teamplan_vat';
    return (<FlexContainer flexDirection="column" gap="32px" sx={{
            borderStyle: 'solid',
            borderColor: 'ds.border.neutral.quiet.idle',
            borderWidth: '1px',
            borderRadius: '4px',
            backgroundColor: 'ds.container.agnostic.neutral.supershy',
            padding: '24px',
        }}>
      <Row label={<Heading size="small">
            {translate('team_account_teamplan_changeplan_order_summary_header')}
          </Heading>} value={<Paragraph color="ds.text.neutral.quiet">
            {dateFormatter(new Date(), 'MM/dd/yyyy')}
          </Paragraph>}/>
      <FlexContainer flexDirection="column" gap="16px" sx={{ padding: '32px 0' }}>
        <OrderSummaryHeader selectedOffer={selectedOffer} currency={currency} costData={costData}/>
      </FlexContainer>
      <FlexContainer flexDirection="column" gap="16px">
        <Paragraph size="small" color="ds.text.neutral.catchy" sx={{ padding: '0 10px', fontWeight: 'light' }}>
          {translate('team_account_teamplan_changeplan_order_summary_seats_total', {
            totalSeats: costData.totalSeats,
        })}
        </Paragraph>
        <Row label={<Paragraph size="small" color="ds.text.neutral.standard">
              {translate('team_account_teamplan_changeplan_order_summary_subtotal')}
            </Paragraph>} value={currency ? (<Paragraph size="small" color="ds.text.neutral.standard">
                {translate.price(currency, costData.subtotal / 100)}
              </Paragraph>) : null}/>
        {costData.tax && currency ? (<Row label={<Paragraph size="small" color="ds.text.neutral.quiet">
                {translate(taxCopy)}
              </Paragraph>} value={<Paragraph size="small" color="ds.text.neutral.quiet">
                {translate.price(currency, costData.tax / 100)}
              </Paragraph>}/>) : null}
        {costData?.proratedDiscount ? (<Row label={<FlexContainer alignItems="center" gap="5px">
                <Paragraph size="small" color="ds.text.neutral.quiet">
                  {translate('team_account_teamplan_changeplan_order_summary_prorated_discount')}
                </Paragraph>
                <Tooltip content={translate('team_account_teamplan_changeplan_order_summary_prorated_discount_tooltip')}>
                  <InfoCircleIcon size={16} color="ds.text.neutral.quiet"/>
                </Tooltip>
              </FlexContainer>} value={currency ? (<Paragraph size="small" color="ds.text.neutral.quiet">
                  {translate.price(currency, costData.proratedDiscount / 100)}
                </Paragraph>) : null}/>) : null}
        {costData?.promoPrice ? (<Row label={<Paragraph size="small" color="ds.text.neutral.quiet">
                {translate('team_account_teamplan_upgrade_premium_coupon')}
              </Paragraph>} value={currency ? (<Paragraph size="small" color="ds.text.neutral.quiet">
                  -{translate.price(currency, costData.promoPrice / 100)}
                </Paragraph>) : null}/>) : null}
        <HorizontalRule />
        {costData?.total ? (<Row label={<Paragraph bold size="large">
                {translate('team_account_teamplan_total')}
              </Paragraph>} value={currency ? (<Paragraph bold size="large">
                  {translate.price(currency, costData.total / 100)}
                </Paragraph>) : null}/>) : null}
      </FlexContainer>
    </FlexContainer>);
};
