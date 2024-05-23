import React from 'react';
import { colors, jsx } from '@dashlane/design-system';
import { format as dateFormatter } from 'date-fns';
import { FlexChild, FlexContainer, Heading, InfoCircleIcon, Paragraph, Tooltip, } from '@dashlane/ui-components';
import useTranslate from 'libs/i18n/useTranslate';
import { useBillingSeatDetails } from 'team/account/upgrade/add-seats/useBillingSeatDetails';
import { CostDetailsForTier } from 'team/account/upgrade/add-seats/teamPlanCalculator';
import { BillingDetails } from 'team/account/upgrade';
interface RowProps {
    label?: React.ReactNode;
    value?: React.ReactNode;
    alignItems?: string;
}
export const Row = ({ label, value, ...props }: RowProps) => (<FlexContainer justifyContent="flex-end" sx={{ display: 'flex', justifyContent: 'flexEnd' }} {...props}>
    {label ? (<FlexChild flex="1" sx={{ display: 'flex', alignItems: 'center' }}>
        {label}
      </FlexChild>) : null}
    {value ? (<FlexChild sx={{ display: 'flex', alignItems: 'center' }}>
        {value}
      </FlexChild>) : null}
  </FlexContainer>);
interface OrderSummaryProps {
    billingDetails: BillingDetails;
    additionalSeatsDetails: CostDetailsForTier[];
}
export const OrderSummary = ({ billingDetails, additionalSeatsDetails, }: OrderSummaryProps) => {
    const { translate } = useTranslate();
    const { additionalSeatsCount, additionalSeatsTaxesTranslation, hasTax, tierPriceTranslation, proratedDiscountTranslation, hasProratedDiscount, dueTodayTranslation, } = useBillingSeatDetails({
        billingDetails,
        additionalSeatsDetails,
    });
    return (<FlexContainer flexDirection="column" gap="32px" sx={{
            borderStyle: 'solid',
            borderColor: 'ds.border.neutral.quiet.idle',
            borderWidth: '1px',
            backgroundColor: 'ds.container.agnostic.neutral.supershy',
            padding: '24px',
            borderRadius: '4px',
        }}>
      <Row alignItems="end" label={<Heading size="small">
            {translate('team_account_addseats_success_order_summary_header')}
          </Heading>} value={<Paragraph color="ds.text.neutral.quiet">
            {dateFormatter(new Date(), 'MM/dd/yyyy')}
          </Paragraph>}/>
      <FlexContainer flexDirection="column" gap="16px">
        <Row label={<Paragraph size="small" color="ds.text.neutral.catchy">
              {translate('team_account_teamplan_upgrade_new_seat', {
                count: additionalSeatsCount,
            })}
            </Paragraph>} value={<Paragraph size="small" color="ds.text.neutral.catchy">
              {tierPriceTranslation}
            </Paragraph>}/>
        {hasTax ? (<Row label={<Paragraph size="small" color="ds.text.neutral.catchy">
                {translate('team_account_addseats_success_order_summary_tax')}
              </Paragraph>} value={<Paragraph size="small" color="ds.text.neutral.catchy">
                {additionalSeatsTaxesTranslation}
              </Paragraph>}/>) : null}
        {hasProratedDiscount ? (<Row label={<FlexContainer alignItems="center" gap="5px">
                <Paragraph size="small" color="ds.text.neutral.catchy">
                  {translate('team_account_addseats_success_order_summary_prorated_discount')}
                </Paragraph>
                <Tooltip content={translate('team_account_addseats_success_order_summary_prorated_discount_tooltip')}>
                  <InfoCircleIcon size={16} color="ds.text.neutral.catchy"/>
                </Tooltip>
              </FlexContainer>} value={<Paragraph size="small" color="ds.text.neutral.catchy">
                {proratedDiscountTranslation}
              </Paragraph>}/>) : null}
        <div style={{
            width: '100%',
            borderColor: colors.lightTheme.ds.border.neutral.quiet.idle,
            borderWidth: '1px',
            borderStyle: 'solid',
            borderBottom: '0',
            margin: '0',
        }}/>
        <Row label={<Paragraph size="large" bold color="ds.text.neutral.catchy">
              {translate('team_account_addseats_success_order_summary_total')}
            </Paragraph>} value={<Paragraph size="large" bold color="ds.text.neutral.catchy">
              {dueTodayTranslation}
            </Paragraph>}/>
      </FlexContainer>
    </FlexContainer>);
};
