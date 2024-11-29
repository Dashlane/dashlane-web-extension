import { useState } from "react";
import { Flex } from "@dashlane/design-system";
import { Offer } from "@dashlane/team-admin-contracts";
import useTranslate from "../../../../libs/i18n/useTranslate";
import { ChangePlanCard } from "../../../change-plan/layout/change-plan-card";
import {
  CheckoutOrderSummaryOutput,
  PaymentMethodType,
  PostTrialCheckoutState,
} from "../../types";
import { OrderSummaryHeader } from "./order-summary-header";
import { OrderSummaryBody } from "./order-summary-body";
import { OrderSummaryFooter } from "./order-summary-footer";
const I18N_KEYS = {
  HEADER: "team_account_teamplan_changeplan_order_summary_header",
};
interface OrderSummaryProps {
  billingCountry: string | undefined;
  handleClickAddBillingInfo: () => void;
  paymentMethodType: PaymentMethodType;
  selectedOffer?: Offer;
  selectedSeatsQty: number;
  setErrorMessage: (errorMessage: string) => void;
  setOrderSummaryData: (orderSummaryData: CheckoutOrderSummaryOutput) => void;
  setPostTrialCheckoutState: (
    newPostTrialCheckoutState: PostTrialCheckoutState
  ) => void;
  setSelectedSeatsQty: (newSelectedSeatsQty: number) => void;
  numberOfMembers: number;
}
export const OrderSummary = ({
  billingCountry,
  handleClickAddBillingInfo,
  paymentMethodType,
  selectedOffer,
  selectedSeatsQty,
  setErrorMessage,
  setOrderSummaryData,
  setPostTrialCheckoutState,
  setSelectedSeatsQty,
  numberOfMembers,
}: OrderSummaryProps) => {
  const { translate } = useTranslate();
  const [hasTax, setHasTax] = useState<boolean>(false);
  const [planPrice, setPlanPrice] = useState<number>(0);
  const [renewalPrice, setRenewalPrice] = useState<number>(0);
  const [isSeatsQtyValid, setIsSeatsQtyValid] = useState<boolean>(true);
  return (
    <ChangePlanCard title={translate(I18N_KEYS.HEADER)}>
      <Flex flexDirection="column" gap="16px" sx={{ marginTop: "16px" }}>
        <OrderSummaryHeader
          numberOfMembers={numberOfMembers}
          planPrice={planPrice}
          selectedOffer={selectedOffer}
          selectedSeatsQty={selectedSeatsQty}
          setPlanPrice={setPlanPrice}
          setSelectedSeatsQty={setSelectedSeatsQty}
          setIsSeatsQtyValid={setIsSeatsQtyValid}
        />
        <OrderSummaryBody
          billingCountry={billingCountry}
          paymentMethodType={paymentMethodType}
          isSeatsQtyValid={isSeatsQtyValid}
          planPrice={planPrice}
          selectedOffer={selectedOffer}
          selectedSeatsQty={selectedSeatsQty}
          setErrorMessage={setErrorMessage}
          setHasTax={setHasTax}
          setOrderSummaryData={setOrderSummaryData}
          setPostTrialCheckoutState={setPostTrialCheckoutState}
          setRenewalPrice={setRenewalPrice}
        />
        <OrderSummaryFooter
          billingCountry={billingCountry}
          handleClickAddBillingInfo={handleClickAddBillingInfo}
          hasTax={hasTax}
          selectedSeatsQty={selectedSeatsQty}
          renewalPrice={renewalPrice}
          selectedOffer={selectedOffer}
        />
      </Flex>
    </ChangePlanCard>
  );
};
