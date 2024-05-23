import * as React from 'react';
import { colors, jsx, Paragraph, ThemeUIStyleObject, } from '@dashlane/ui-components';
import useTranslate from 'libs/i18n/useTranslate';
import { Offer } from '@dashlane/team-admin-contracts';
import { UseMidCycleTierUpgradeOutput } from 'team/change-plan/hooks/useMidCycleTierUpgrade';
import { isOfferBusinessTier } from 'team/change-plan/utils';
const planHeaderStyles: ThemeUIStyleObject = {
    display: 'flex',
    alignItems: 'center',
    padding: '12px 10px',
    justifyContent: 'space-between',
    backgroundColor: colors.dashGreen06,
};
interface HeaderProps {
    selectedOffer?: Offer;
    currency?: string;
    costData: UseMidCycleTierUpgradeOutput['costData'];
}
export const OrderSummaryHeader = ({ selectedOffer, currency, costData, }: HeaderProps) => {
    const { translate } = useTranslate();
    if (!selectedOffer || !currency) {
        return (<div sx={planHeaderStyles}>
        <Paragraph color={colors.dashGreen01}>
          {translate('team_account_teamplan_changeplan_order_summary_select_plan')}
        </Paragraph>
      </div>);
    }
    return (<div sx={planHeaderStyles} data-testid="order-summary-plan-name">
      <Paragraph bold color={colors.dashGreen01}>
        {isOfferBusinessTier(selectedOffer)
            ? translate('team_account_teamplan_changeplan_plans_business_name')
            : translate('team_account_teamplan_changeplan_plans_team_name')}
      </Paragraph>
      <Paragraph color={colors.dashGreen01}>
        {translate('team_account_teamplan_changeplan_order_summary_seat_year', {
            cost: translate.price(currency, costData.seatPrice / 100, {
                notation: 'compact',
            }),
        })}
      </Paragraph>
    </div>);
};
