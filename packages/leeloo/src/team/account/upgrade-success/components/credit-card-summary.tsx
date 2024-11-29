import {
  Flex,
  Heading,
  IndeterminateLoader,
  Paragraph,
} from "@dashlane/design-system";
import useTranslate from "../../../../libs/i18n/useTranslate";
import { useCreditCardPaymentMethodDisplay } from "../useCreditCardPaymentDisplay";
import { SMALL_CARD_CONTAINER } from "./styles";
export const CreditCardSummary = () => {
  const { translate } = useTranslate();
  const { loading, last4DigitsFormatted, expFormatted, cardSvg } =
    useCreditCardPaymentMethodDisplay({});
  if (loading) {
    return <IndeterminateLoader />;
  }
  return (
    <Flex flexDirection="column" gap="16px" sx={SMALL_CARD_CONTAINER}>
      <Heading as="h2" color="ds.text.neutral.catchy">
        {translate("team_account_addseats_success_credit_card_header")}
      </Heading>
      <Flex flexDirection="column" gap="8px">
        <Flex alignItems="center" gap="8px">
          {cardSvg}
          <Paragraph color="ds.text.neutral.standard">
            •••• {last4DigitsFormatted}
          </Paragraph>
        </Flex>
        <Flex>
          <Paragraph color="ds.text.neutral.standard">
            {translate("team_account_addseats_success_credit_card_expires", {
              expirationDate: expFormatted,
            })}
          </Paragraph>
        </Flex>
      </Flex>
    </Flex>
  );
};
