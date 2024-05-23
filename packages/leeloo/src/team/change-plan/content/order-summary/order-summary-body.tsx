import * as React from 'react';
import { colors, FlexChild, FlexContainer, InfoCircleIcon, jsx, LoadingIcon, Paragraph, Tooltip, } from '@dashlane/ui-components';
import { SpinnerInput } from 'libs/dashlane-style/spinner-input/spinner-input';
import useTranslate from 'libs/i18n/useTranslate';
import { Offer } from '@dashlane/team-admin-contracts';
import { HorizontalRule } from 'team/change-plan/components/HorizontalRule';
import { UseMidCycleTierUpgradeOutput } from 'team/change-plan/hooks/useMidCycleTierUpgrade';
import { Row } from 'team/change-plan/components/row';
import { useBillingCountry } from 'team/helpers/useBillingCountry';
interface OrderSummaryBodyProps {
    currency: string | undefined;
    costData: UseMidCycleTierUpgradeOutput['costData'];
    isProratedDiscountLoading: boolean;
    isTaxLoading: boolean;
    selectedOffer?: Offer;
    setAdditionalSeats: (newAdditionalSeats: number) => void;
}
export const OrderSummaryBody = ({ currency, costData, isProratedDiscountLoading, isTaxLoading, selectedOffer, setAdditionalSeats, }: OrderSummaryBodyProps) => {
    const { translate } = useTranslate();
    const { loading, billingCountry } = useBillingCountry();
    if (loading) {
        return <LoadingIcon color={colors.midGreen00}/>;
    }
    const taxCopy = billingCountry === 'US'
        ? 'team_account_teamplan_changeplan_order_summary_tax'
        : 'team_account_teamplan_vat';
    return (<React.Fragment>
      {selectedOffer && currency ? (<React.Fragment>
          <Row label={<Paragraph bold size="medium">
                {translate('team_account_teamplan_changeplan_order_summary_seats_total', {
                    totalSeats: costData.totalSeats,
                })}
              </Paragraph>} value={<FlexChild sx={{ width: '146px' }}>
                <SpinnerInput id="test" inputWidth="66px" label="" minValue={0} onChange={setAdditionalSeats} defaultValue={0}/>
              </FlexChild>}/>
          <Row label={<Paragraph bold size="small">
                {translate('team_account_teamplan_changeplan_order_summary_seats_upgraded', {
                    upgradedSeats: costData.currentSeats,
                })}
              </Paragraph>} value={<Paragraph bold size="small">
                {translate.price(currency, costData.upgradedSeatsPrice / 100)}
              </Paragraph>}/>
          {costData.additionalSeats ? (<Row label={<Paragraph bold size="small">
                  {translate('team_account_teamplan_changeplan_order_summary_seats_new', {
                        newSeats: costData.additionalSeats,
                    })}
                </Paragraph>} value={<Paragraph bold size="small">
                  {translate.price(currency, costData.additionalSeatsPrice / 100)}
                </Paragraph>}/>) : null}

          <HorizontalRule />

          <Row label={<Paragraph bold size="small">
                {translate('team_account_teamplan_changeplan_order_summary_subtotal')}
              </Paragraph>} value={currency ? (<Paragraph bold size="small">
                  {translate.price(currency, costData.subtotal / 100)}
                </Paragraph>) : null}/>
          {costData?.proratedDiscount ? (<Row label={<FlexContainer alignItems="center" gap="5px">
                  <Paragraph size="small" color={colors.grey00}>
                    {translate('team_account_teamplan_changeplan_order_summary_prorated_discount')}
                  </Paragraph>
                  <Tooltip content={translate('team_account_teamplan_changeplan_order_summary_prorated_discount_tooltip')}>
                    <InfoCircleIcon size={16} color={colors.grey00}/>
                  </Tooltip>
                </FlexContainer>} value={isProratedDiscountLoading ? (<LoadingIcon color={colors.black} size={13}/>) : costData.proratedDiscount && currency ? (<Paragraph size="small" color={colors.grey00}>
                    {translate.price(currency, costData.proratedDiscount / 100)}
                  </Paragraph>) : null}/>) : null}
          {costData.tax ? (<Row label={<Paragraph size="small" color={colors.grey00}>
                  {translate(taxCopy)}
                </Paragraph>} value={isTaxLoading ? (<LoadingIcon color={colors.black} size={13}/>) : (<Paragraph size="small" color={colors.grey00}>
                    {translate.price(currency, costData.tax / 100)}
                  </Paragraph>)}/>) : null}
        </React.Fragment>) : null}
    </React.Fragment>);
};
