import { Badge, Paragraph } from "@dashlane/design-system";
import useTranslate from "../../../../libs/i18n/useTranslate";
const I18N_KEYS = {
  EXPIRED_BADGE: "account_summary_payment_card_expired_badge",
  PAYMENT_CARD_EXPIRES_IN:
    "manage_subscription_payment_section_expiration_date",
};
interface Props {
  cardSvg: JSX.Element;
  last4DigitsFormatted: string;
  expFormatted: string;
  isExpired: boolean;
}
export const CreditCardInfo = ({
  cardSvg,
  last4DigitsFormatted,
  expFormatted,
  isExpired,
}: Props) => {
  const { translate } = useTranslate();
  return (
    <div sx={{ display: "flex", alignItems: "center", gap: "8px" }}>
      {cardSvg}
      <div>
        <Paragraph
          data-testid="card-last-four"
          sx={{ display: "flex", gap: "4px" }}
        >
          •••• {last4DigitsFormatted}
          {isExpired ? (
            <Badge
              label={translate(I18N_KEYS.EXPIRED_BADGE)}
              mood="danger"
              sx={{ alignSelf: "center" }}
            />
          ) : null}
        </Paragraph>
        <Paragraph
          textStyle="ds.body.reduced.regular"
          color="ds.text.neutral.quiet"
        >
          {translate(I18N_KEYS.PAYMENT_CARD_EXPIRES_IN, {
            date: expFormatted,
          })}
        </Paragraph>
      </div>
    </div>
  );
};
