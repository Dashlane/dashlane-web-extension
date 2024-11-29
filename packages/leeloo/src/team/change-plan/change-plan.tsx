import { useContext, useEffect, useState } from "react";
import { DataStatus } from "@dashlane/carbon-api-consumers";
import { Flex, IndeterminateLoader, useToast } from "@dashlane/design-system";
import { Button, ClickOrigin, UserClickEvent } from "@dashlane/hermes";
import { useModuleQuery } from "@dashlane/framework-react";
import {
  BillingMethod,
  Offer,
  SpaceTier,
  teamPlanDetailsApi,
} from "@dashlane/team-admin-contracts";
import { useTeamBillingInformation } from "../../libs/hooks/use-team-billing-information";
import { logEvent } from "../../libs/logs/logEvent";
import { getUrlSearchParams } from "../../libs/router";
import { PaymentMethodCard } from "../../webapp/subscription-management/payment-method/payment-method-card";
import { CreditCardSummary } from "../account/upgrade-success/components/credit-card-summary";
import { BackButton } from "./components/back-button";
import { useBillingCountry } from "../helpers/useBillingCountry";
import { NavBarContext } from "../page/nav-layout/nav-layout";
import { useTeamOffers } from "../hooks/use-team-offers";
import { BillingContact, OrderSuccess, OrderSummary, Plans } from "./content";
import { OrderSummarySuccess } from "./content/order-summary-success";
import { PaymentMethodInvoice } from "./content/payment-method-invoice";
import { VatNumber } from "../components/vat-number/vat-number";
import { ChangePlanState, OrderSummaryDataOutput } from "./types";
import { isOfferBusinessTier, isOfferTeamTier } from "./utils";
import { Questions } from "../components/questions";
export const ChangePlan = () => {
  const teamOffers = useTeamOffers();
  const billingInformation = useTeamBillingInformation();
  const setNavBarChildren = useContext(NavBarContext);
  const { showToast } = useToast();
  const { data: teamSeatsData, status: teamSeatsStatus } = useModuleQuery(
    teamPlanDetailsApi,
    "getTeamSeats"
  );
  const { loading: isBillingCountryLoading, billingCountry } =
    useBillingCountry();
  const [selectedSeatsQty, setSelectedSeatsQty] = useState(0);
  const [selectedOffer, setSelectedOffer] = useState<Offer>();
  const [email, setEmail] = useState<string>("");
  const [emailValid, setEmailValid] = useState<boolean>(true);
  const [changePlanState, setChangePlanState] = useState<ChangePlanState>(
    ChangePlanState.FORM
  );
  const [orderSummaryData, setOrderSummaryData] =
    useState<OrderSummaryDataOutput>();
  const [errorMessage, setErrorMessage] = useState<string>("");
  const currentSeats =
    (teamSeatsData?.paid ?? 0) + (teamSeatsData?.extraFree ?? 0);
  const currentActiveSeats = currentSeats - (teamSeatsData?.remaining ?? 0);
  const currentSpaceTier = billingInformation?.spaceTier;
  useEffect(() => {
    if (errorMessage !== "") {
      showToast({
        mood: "danger",
        description: errorMessage,
      });
    }
    setErrorMessage("");
  }, [errorMessage]);
  const logChangePlanEvent = (newPlan: Offer) => {
    logEvent(
      new UserClickEvent({
        clickOrigin: ClickOrigin.Plans,
        button: isOfferTeamTier(newPlan)
          ? Button.SelectTeamPlan
          : isOfferBusinessTier(newPlan)
          ? Button.SelectBusinessPlan
          : Button.SelectStarterPlan,
      })
    );
  };
  useEffect(() => {
    if (changePlanState === ChangePlanState.FORM) {
      setNavBarChildren(<BackButton />);
    } else {
      setNavBarChildren(null);
    }
    return () => {
      setNavBarChildren(null);
    };
  }, [changePlanState]);
  useEffect(() => {
    if (!teamOffers) {
      return;
    }
    const plan = getUrlSearchParams().get("plan");
    if (
      plan === "business" ||
      currentSpaceTier === SpaceTier.Team ||
      currentSpaceTier === SpaceTier.Starter ||
      currentSpaceTier === SpaceTier.Standard
    ) {
      setSelectedOffer(teamOffers.businessOffer);
    }
  }, [teamOffers]);
  if (
    isBillingCountryLoading ||
    teamSeatsStatus !== DataStatus.Success ||
    !teamSeatsData ||
    !billingInformation ||
    !teamOffers ||
    !currentSpaceTier
  ) {
    return <IndeterminateLoader mood="brand" />;
  }
  const hasInvoicePaymentMethod =
    billingInformation.billingType === BillingMethod.Invoice;
  const currency = teamOffers.businessOffer.currency;
  return (
    <Flex sx={{ margin: "45px", width: "1180px" }}>
      <Flex flexDirection="column" gap="8px">
        {changePlanState === ChangePlanState.FORM ? (
          <Flex gap="8px">
            <div sx={{ width: "646px" }}>
              <Flex flexDirection="column" flexWrap="nowrap" gap="8px">
                <Plans
                  teamOffers={teamOffers}
                  currentSpaceTier={currentSpaceTier}
                  selectedOffer={selectedOffer}
                  handleSelection={(newPlan: Offer) => {
                    logChangePlanEvent(newPlan);
                    setSelectedOffer(newPlan);
                  }}
                />
                {hasInvoicePaymentMethod ? (
                  <PaymentMethodInvoice />
                ) : billingCountry !== "US" ? (
                  <>
                    <PaymentMethodCard b2b styles={{ padding: "24px" }} />
                    <VatNumber isInAccountSummary={false} />
                    <BillingContact
                      email={email}
                      emailValid={emailValid}
                      setEmail={setEmail}
                      setEmailValid={setEmailValid}
                    />
                  </>
                ) : (
                  <>
                    <PaymentMethodCard b2b styles={{ padding: "24px" }} />
                    <BillingContact
                      email={email}
                      emailValid={emailValid}
                      setEmail={setEmail}
                      setEmailValid={setEmailValid}
                    />
                  </>
                )}
              </Flex>
            </div>
            <div sx={{ width: "470px" }}>
              <Flex flexDirection="column" gap="8px">
                <OrderSummary
                  currentSeats={currentSeats}
                  currentActiveSeats={currentActiveSeats}
                  currentSpaceTier={currentSpaceTier}
                  selectedSeatsQty={selectedSeatsQty}
                  currency={currency}
                  selectedOffer={selectedOffer}
                  email={email}
                  emailValid={emailValid}
                  onSuccess={() => {
                    setChangePlanState(() => ChangePlanState.SUCCESS);
                  }}
                  onError={(error) => {
                    setErrorMessage(error);
                  }}
                  setSelectedSeatsQty={setSelectedSeatsQty}
                  setOrderSummaryData={setOrderSummaryData}
                />
                <Questions contactSupport={true} />
              </Flex>
            </div>
          </Flex>
        ) : null}

        {changePlanState === ChangePlanState.SUCCESS &&
        orderSummaryData &&
        selectedOffer ? (
          <Flex flexWrap="nowrap" gap="16px">
            <Flex
              flexDirection="column"
              sx={{
                flexGrow: "2",
                maxWidth: "752px",
              }}
            >
              <OrderSuccess
                targetPlan={
                  isOfferBusinessTier(selectedOffer) ? "business" : "team"
                }
              />
            </Flex>
            <Flex
              gap="16px"
              flexDirection="column"
              sx={{
                flexGrow: "1",
                width: "368px",
              }}
            >
              <OrderSummarySuccess
                currency={currency}
                selectedOffer={selectedOffer}
                costData={orderSummaryData}
              />
              <CreditCardSummary />
            </Flex>
          </Flex>
        ) : null}
      </Flex>
    </Flex>
  );
};
