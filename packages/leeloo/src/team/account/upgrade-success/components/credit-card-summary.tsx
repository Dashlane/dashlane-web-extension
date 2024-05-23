import { jsx } from '@dashlane/design-system';
import { colors, FlexContainer, Heading, LoadingIcon, Paragraph, } from '@dashlane/ui-components';
import useTranslate from 'libs/i18n/useTranslate';
import { useCreditCardPaymentMethodDisplay } from '../useCreditCardPaymentDisplay';
export const CreditCardSummary = () => {
    const { translate } = useTranslate();
    const { loading, last4DigitsFormatted, expFormatted, cardSvg } = useCreditCardPaymentMethodDisplay({});
    if (loading) {
        return <LoadingIcon color={colors.midGreen00}/>;
    }
    return (<FlexContainer flexDirection="column" gap="16px" sx={{
            borderStyle: 'solid',
            borderColor: 'ds.border.neutral.quiet.idle',
            borderWidth: '1px',
            backgroundColor: 'ds.container.agnostic.neutral.supershy',
            padding: '24px',
            borderRadius: '4px',
        }}>
      <Heading size="small">
        {translate('team_account_addseats_success_credit_card_header')}
      </Heading>
      <FlexContainer flexDirection="column" gap="8px">
        <FlexContainer alignItems="center" gap="8px">
          {cardSvg}
          <Paragraph color="ds.text.neutral.standard">
            •••• {last4DigitsFormatted}
          </Paragraph>
        </FlexContainer>
        <FlexContainer>
          <Paragraph color="ds.text.neutral.standard">
            {translate('team_account_addseats_success_credit_card_expires', {
            expirationDate: expFormatted,
        })}
          </Paragraph>
        </FlexContainer>
      </FlexContainer>
    </FlexContainer>);
};
