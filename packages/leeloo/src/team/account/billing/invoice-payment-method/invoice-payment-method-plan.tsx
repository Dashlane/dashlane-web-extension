import { FlexContainer, jsx, Link, Paragraph } from '@dashlane/ui-components';
import { Icon } from '@dashlane/design-system';
import useTranslate from 'libs/i18n/useTranslate';
import { DASHLANE_SUPPORT } from 'team/urls';
export const InvoicePaymentMethodPlan = () => {
    const { translate } = useTranslate();
    return (<FlexContainer gap="16px" sx={{ margin: '24px 0' }}>
      <Paragraph color="ds.text.neutral.catchy" as="h2" size="large">
        {translate('team_account_invoice_payment_plan_heading')}
      </Paragraph>
      <div>
        <Paragraph color="ds.text.neutral.quiet" size="small">
          {translate('team_account_invoice_payment_plan_pay_credit_card')}
        </Paragraph>
        <Paragraph size="small">
          <Link href={DASHLANE_SUPPORT} target="_blank" rel="noopener noreferrer" sx={{ color: 'ds.text.neutral.quiet', fontWeight: '400' }}>
            {translate('team_account_invoice_payment_plan_contact_support')}
          </Link>
        </Paragraph>
      </div>
      <FlexContainer flexDirection="row" gap="8px" alignItems="center" sx={{ width: '100%' }}>
        <div sx={{
            padding: '8px',
            backgroundColor: 'ds.container.expressive.brand.quiet.idle',
            borderRadius: '8px',
        }}>
          <Icon name="ItemTaxNumberOutlined" size="large" color="ds.text.brand.standard"/>
        </div>
        <Paragraph color="ds.text.neutral.catchy" size="medium">
          {translate('team_account_invoice_payment')}
        </Paragraph>
      </FlexContainer>
    </FlexContainer>);
};
