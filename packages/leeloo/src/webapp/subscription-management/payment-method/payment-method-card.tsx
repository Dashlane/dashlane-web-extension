import { useState } from "react";
import {
  Card,
  Heading,
  IndeterminateLoader,
  LinkButton,
  Paragraph,
  ThemeUIStyleObject,
} from "@dashlane/design-system";
import { DataStatus } from "@dashlane/carbon-api-consumers";
import { FlowStep } from "@dashlane/hermes";
import { PaymentLoading } from "../../../libs/billing/PaymentLoading";
import { usePremiumStatus } from "../../../libs/carbon/hooks/usePremiumStatus";
import useTranslate from "../../../libs/i18n/useTranslate";
import { useCreditCardPaymentMethodDisplay } from "../../../team/account/upgrade-success/useCreditCardPaymentDisplay";
import { PaymentMethodDetails } from "./payment-method-details";
import { logUserUpdatePaymentMethodEvent } from "../logs";
const I18N_KEYS = {
  CARD_TITLE: "manage_subscription_payment_section_title",
  TEXT_NO_PAYMENT_METHOD_SAVED:
    "manage_subscription_payment_section_no_payment",
  BUTTON_UPDATE_PAYMENT: "manage_subscription_payment_section_update_details",
};
interface Props {
  b2b?: boolean;
  hideTitle?: boolean;
  hideUpdateButton?: boolean;
  styles?: ThemeUIStyleObject;
}
export const PaymentMethodCard = ({
  b2b,
  hideTitle,
  hideUpdateButton,
  styles,
}: Props) => {
  const { translate } = useTranslate();
  const premiumStatus = usePremiumStatus();
  const [paymentLoading, setPaymentLoading] = useState(false);
  const handleCardUpdate = (updateSuccessful: boolean) => {
    if (updateSuccessful && premiumStatus.status === DataStatus.Success) {
      logUserUpdatePaymentMethodEvent(premiumStatus.data, FlowStep.Complete);
    }
  };
  const { pollUntilCardUpdate } = useCreditCardPaymentMethodDisplay({
    b2c: !b2b,
    handleCardUpdate,
  });
  const { loading, billingInformation } = useCreditCardPaymentMethodDisplay({
    b2c: !b2b,
  });
  if (
    premiumStatus.status !== DataStatus.Success ||
    !premiumStatus.data ||
    loading
  ) {
    return <IndeterminateLoader />;
  }
  const isAppStoreUser = premiumStatus.data?.planType?.includes("ios") ?? false;
  const isGooglePlayUser =
    premiumStatus.data?.planType?.includes("playstore") ?? false;
  const hasPaymentMethod =
    billingInformation?.last4 || isAppStoreUser || isGooglePlayUser;
  const handleClickUpdate = () => {
    pollUntilCardUpdate();
    setPaymentLoading(true);
    logUserUpdatePaymentMethodEvent(premiumStatus.data, FlowStep.Start);
  };
  return (
    <Card sx={styles}>
      <div sx={{ display: "flex", justifyContent: "space-between" }}>
        {hideTitle ? null : (
          <Heading as="h2">{translate(I18N_KEYS.CARD_TITLE)}</Heading>
        )}
        {hideUpdateButton ||
        isAppStoreUser ||
        isGooglePlayUser ? null : paymentLoading ? (
          <PaymentLoading b2c={true} setPaymentLoading={setPaymentLoading} />
        ) : (
          <LinkButton onClick={handleClickUpdate} isExternal as="button">
            {translate(I18N_KEYS.BUTTON_UPDATE_PAYMENT)}
          </LinkButton>
        )}
      </div>

      {hasPaymentMethod ? (
        <PaymentMethodDetails
          b2c={!b2b}
          isAppStoreUser={isAppStoreUser}
          isGooglePlayUser={isGooglePlayUser}
        />
      ) : (
        <div sx={{ marginTop: "8px" }}>
          <Paragraph color="ds.text.neutral.quiet">
            {translate(I18N_KEYS.TEXT_NO_PAYMENT_METHOD_SAVED)}
          </Paragraph>
        </div>
      )}
    </Card>
  );
};
