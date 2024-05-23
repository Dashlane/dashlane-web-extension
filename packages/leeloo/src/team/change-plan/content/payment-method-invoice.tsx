import { colors, FiscalIcon, FlexContainer, Paragraph, } from '@dashlane/ui-components';
import useTranslate from 'libs/i18n/useTranslate';
import * as React from 'react';
import { ChangePlanCard } from '../layout/change-plan-card';
export const PaymentMethodInvoice = () => {
    const { translate } = useTranslate();
    return (<ChangePlanCard title={translate('team_account_teamplan_changeplan_payment_method_header')}>
      <FlexContainer sx={{ display: 'flex', gap: '6px', marginTop: '16px' }}>
        <FiscalIcon size={16} color={colors.grey00}/>
        <Paragraph size="medium" color={colors.grey00}>
          {translate('team_account_teamplan_changeplan_payment_method_invoice_body')}
        </Paragraph>
      </FlexContainer>
    </ChangePlanCard>);
};
