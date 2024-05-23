import * as React from 'react';
import { Button, FlexContainer, InfoBox, jsx, Paragraph, } from '@dashlane/ui-components';
import useTranslate from 'libs/i18n/useTranslate';
import { Offer } from '@dashlane/team-admin-contracts';
import { UseMidCycleTierUpgradeOutput } from '../../hooks/useMidCycleTierUpgrade';
import { Row } from 'team/change-plan/components/row';
import { DASHLANE_SUPPORT_DASHLANE_FOR_BUSINESS } from 'team/urls';
interface OrderSummaryProps {
    selectedOffer?: Offer;
    costData: UseMidCycleTierUpgradeOutput['costData'];
}
export const OrderSummaryBodyInvoice = ({ selectedOffer, costData, }: OrderSummaryProps) => {
    const { translate } = useTranslate();
    return (<React.Fragment>
      {selectedOffer ? (<React.Fragment>
          <Row label={<FlexContainer gap="5px">
                <Paragraph bold size="medium">
                  {translate('team_account_teamplan_changeplan_order_summary_seats_total', {
                    totalSeats: costData.totalSeats,
                })}
                </Paragraph>

                <Paragraph bold size="medium">
                  (
                  {translate('team_account_teamplan_changeplan_order_summary_seats_new', {
                    newSeats: costData.additionalSeats,
                })}
                  )
                </Paragraph>
              </FlexContainer>}/>
          <InfoBox severity="subtle" size="small" title={translate('team_account_teamplan_changeplan_order_summary_invoice_info')}/>
        </React.Fragment>) : null}

      <Button data-testid="btn-request-a-quote" size="large" sx={{ width: '100%' }} type="button" disabled={!selectedOffer} onClick={() => {
            window.open(DASHLANE_SUPPORT_DASHLANE_FOR_BUSINESS, '_blank');
        }}>
        {translate('team_account_teamplan_changeplan_order_summary_request_an_upgrade')}
      </Button>
    </React.Fragment>);
};
