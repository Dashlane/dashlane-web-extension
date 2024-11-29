import { LinkButton, Paragraph } from "@dashlane/design-system";
import {
  APP_STORE_BILL_HISTORY,
  GOOGLE_PLAY_BILL_HISTORY,
} from "../../../app/routes/constants";
import useTranslate from "../../../libs/i18n/useTranslate";
import { openDashlaneUrl } from "../../../libs/external-urls";
import { useCreditCardPaymentMethodDisplay } from "../../../team/account/upgrade-success/useCreditCardPaymentDisplay";
const I18N_KEYS = {
  APPLE_MANAGE_PAYMENT: "manage_subscription_payment_section_desc_apple",
  BUTTON_LEARN_MORE: "manage_subscription_learn_more_button",
  EXPIRATION_DATE: "manage_subscription_payment_section_expiration_date",
  EXPIRATION_MESSAGE: "manage_subscription_payment_section_expired_stripe",
  GOOGLE_MANAGE_PAYMENT: "manage_subscription_payment_section_desc_google",
};
interface Props {
  b2c: boolean;
  isAppStoreUser: boolean;
  isGooglePlayUser: boolean;
}
export const PaymentMethodDetails = ({
  b2c,
  isAppStoreUser,
  isGooglePlayUser,
}: Props) => {
  const { translate } = useTranslate();
  const { last4DigitsFormatted, cardSvg, isExpired, expFormatted } =
    useCreditCardPaymentMethodDisplay({ b2c });
  const storeDescriptionText = isAppStoreUser
    ? I18N_KEYS.APPLE_MANAGE_PAYMENT
    : I18N_KEYS.GOOGLE_MANAGE_PAYMENT;
  const expirationDate = expFormatted
    ? translate(I18N_KEYS.EXPIRATION_DATE, {
        date: expFormatted,
      })
    : null;
  const goGetOutsideSupport = () => {
    openDashlaneUrl(
      isAppStoreUser ? APP_STORE_BILL_HISTORY : GOOGLE_PLAY_BILL_HISTORY,
      {
        type: "checkout",
        action: "goToPayment",
      }
    );
  };
  return (
    <div
      sx={{
        gap: "8px",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {isAppStoreUser || isGooglePlayUser ? (
        <>
          <Paragraph color="ds.text.neutral.quiet">
            {translate(storeDescriptionText)}
          </Paragraph>
          <LinkButton onClick={goGetOutsideSupport} isExternal>
            {translate(I18N_KEYS.BUTTON_LEARN_MORE)}
          </LinkButton>
        </>
      ) : (
        <div sx={{ display: "flex", alignItems: "center", gap: "8px" }}>
          {cardSvg}
          <div>
            <Paragraph
              color="ds.text.neutral.standard"
              textStyle="ds.body.reduced.strong"
              sx={{ display: "flex", gap: "4px" }}
            >
              <span>••••</span>
              <span data-testid="card-last-four">{last4DigitsFormatted}</span>
            </Paragraph>

            {isExpired ? (
              <Paragraph
                color="ds.text.danger.standard"
                textStyle="ds.body.reduced.strong"
              >
                {translate(I18N_KEYS.EXPIRATION_MESSAGE)}
              </Paragraph>
            ) : (
              <Paragraph color="ds.text.neutral.quiet">
                {expirationDate}
              </Paragraph>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
