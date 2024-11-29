import { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import {
  Badge,
  Button,
  Card,
  Flex,
  Heading,
  IndeterminateLoader,
  Paragraph,
  useColorMode,
  useToast,
} from "@dashlane/design-system";
import WhySecurityTeamsAreImportantDark from "@dashlane/design-system/assets/illustrations/why-security-teams-are-important@2x-dark.webp";
import WhySecurityTeamsAreImportantLight from "@dashlane/design-system/assets/illustrations/why-security-teams-are-important@2x-light.webp";
import {
  DataStatus,
  useFeatureFlips,
  useModuleQuery,
} from "@dashlane/framework-react";
import { Offer, teamPlanDetailsApi } from "@dashlane/team-admin-contracts";
import {
  Button as HermesButton,
  PageView,
  UserClickEvent,
} from "@dashlane/hermes";
import { useTeamBillingInformation } from "../../libs/hooks/use-team-billing-information";
import { logEvent, logPageView } from "../../libs/logs/logEvent";
import useTranslate from "../../libs/i18n/useTranslate";
import { usePremiumStatus } from "../../libs/carbon/hooks/usePremiumStatus";
import { useRouterGlobalSettingsContext } from "../../libs/router";
import { useTeamId } from "../hooks/use-team-id";
import { useTeamOffers } from "../hooks/use-team-offers";
import { useTeamMembersNG } from "../hooks/use-team-members";
import { VatNumber } from "../components/vat-number/vat-number";
import { Questions } from "../components/questions";
import { useBillingCountry } from "../helpers/useBillingCountry";
import { isOfferBusinessTier } from "../change-plan/utils";
import { PaymentSelection } from "./content/payment-selection";
import { OrderSummary } from "./content/order-summary/order-summary";
import { PlanSelection } from "./content/plan-selection";
import { OrderSummarySuccess } from "./content/order-summary/order-summary-success";
import {
  CheckoutOrderSummaryOutput,
  PaymentMethodType,
  PaymentMethodTypeEnum,
  PostTrialCheckoutState,
} from "./types";
import { usePaymentMethodActions } from "./hooks/use-payment-method-actions";
const I18N_KEYS = {
  HEADING: "team_post_trial_checkout_heading",
  DESCRIPTION: "team_post_trial_checkout_description",
  SUCCESS_IMG_ALT: "team_post_trial_checkout_success_img_alt",
  SUCCESS_BADGE_LABEL: "team_post_trial_checkout_success_badge_label",
  SUCCESS_HEADING: "team_post_trial_checkout_success_heading",
  SUCCESS_DESCRIPTION: "team_post_trial_checkout_success_description",
  SUCCESS_BUTTON_START_INVITING_USERS:
    "team_post_trial_checkout_success_button_start_inviting_users",
  SUCCESS_BUTTON_REVIEW_YOUR_SUBSCRIPTION:
    "team_post_trial_checkout_success_button_review_your_subscription",
};
const POST_TRIAL_CHECKOUT_FF = "monetization_extension_post_trial_checkout";
export const MINIMUM_SEAT_PURCHASE_QTY = 2;
export const PostTrialCheckout = () => {
  const history = useHistory();
  const { routes } = useRouterGlobalSettingsContext();
  const { translate } = useTranslate();
  const featureFlipsResult = useFeatureFlips();
  const billingInformation = useTeamBillingInformation();
  const premiumStatus = usePremiumStatus();
  const { showToast } = useToast();
  const { data: teamSeatsData, status: teamSeatsStatus } = useModuleQuery(
    teamPlanDetailsApi,
    "getTeamSeats"
  );
  const { loading: isBillingCountryLoading, billingCountry } =
    useBillingCountry();
  const [postTrialCheckoutState, setPostTrialCheckoutState] =
    useState<PostTrialCheckoutState>(PostTrialCheckoutState.FORM);
  const teamOffers = useTeamOffers();
  const teamId = useTeamId();
  const teamMembers = useTeamMembersNG(
    teamId.status === DataStatus.Success ? teamId.teamId : null
  );
  const [colorMode] = useColorMode();
  const [selectedOffer, setSelectedOffer] = useState<Offer>();
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [selectedSeatsQty, setSelectedSeatsQty] = useState<number>(
    MINIMUM_SEAT_PURCHASE_QTY
  );
  const [paymentMethodType, setPaymentMethodType] = useState<PaymentMethodType>(
    PaymentMethodTypeEnum.CREDIT_CARD
  );
  const [orderSummaryData, setOrderSummaryData] =
    useState<CheckoutOrderSummaryOutput>();
  const [numberOfMembers, setNumberOfMembers] = useState<number | null>(null);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const currentSpaceTier = billingInformation?.spaceTier;
  const { handleClickAddBillingInfo, handleClickEditBillingInfo } =
    usePaymentMethodActions({ setPaymentLoading, premiumStatus });
  useEffect(() => {
    if (teamMembers?.data) {
      setNumberOfMembers(teamMembers.data?.members.length);
    }
  }, [teamMembers]);
  useEffect(() => {
    if (errorMessage !== "") {
      showToast({
        mood: "danger",
        description: errorMessage,
      });
    }
    setErrorMessage("");
  }, [errorMessage]);
  useEffect(() => {
    logPageView(PageView.TacCheckout);
  }, []);
  const logPostTrialCheckoutEvent = (newPlan: Offer) => {
    logEvent(
      new UserClickEvent({
        button: isOfferBusinessTier(newPlan)
          ? HermesButton.SelectBusinessPlan
          : HermesButton.SelectStandardPlan,
      })
    );
  };
  const shouldShowLoader =
    isBillingCountryLoading ||
    teamSeatsStatus !== DataStatus.Success ||
    !teamSeatsData ||
    !billingInformation ||
    !teamOffers ||
    !currentSpaceTier ||
    !numberOfMembers;
  const isPostTrialCheckoutEnabled =
    featureFlipsResult.status === DataStatus.Success &&
    featureFlipsResult.data[POST_TRIAL_CHECKOUT_FF];
  if (
    !isPostTrialCheckoutEnabled ||
    teamId.status !== DataStatus.Success ||
    typeof teamId.teamId !== "number"
  ) {
    return null;
  }
  const renderLoader = () => {
    return (
      <IndeterminateLoader
        mood="brand"
        size="xlarge"
        sx={{ left: "50%", top: "50%", position: "absolute" }}
      />
    );
  };
  const renderForm = () => {
    return shouldShowLoader
      ? renderLoader()
      : postTrialCheckoutState === PostTrialCheckoutState.FORM &&
          typeof teamId.teamId === "number" && (
            <>
              <Flex
                flexDirection="column"
                gap="16px"
                sx={{ padding: "32px 0" }}
              >
                <Heading
                  as="h1"
                  textStyle="ds.title.section.large"
                  color="ds.text.neutral.catchy"
                >
                  {translate(I18N_KEYS.HEADING)}
                </Heading>
                <Paragraph
                  textStyle="ds.title.block.medium"
                  color="ds.text.neutral.catchy"
                >
                  {translate(I18N_KEYS.DESCRIPTION)}
                </Paragraph>
              </Flex>
              <Flex flexDirection="column" gap="16px">
                <Flex gap="16px">
                  <div sx={{ width: "751px" }}>
                    <Flex flexDirection="column" gap="16px" flexWrap="nowrap">
                      <PlanSelection
                        currentSpaceTier={currentSpaceTier}
                        handleSelection={(newPlan: Offer) => {
                          logPostTrialCheckoutEvent(newPlan);
                          setSelectedOffer(newPlan);
                        }}
                        selectedOffer={selectedOffer}
                        teamOffers={teamOffers}
                        numberOfMembers={numberOfMembers}
                      />
                      <PaymentSelection
                        handleClickAddBillingInfo={handleClickAddBillingInfo}
                        handleClickEditBillingInfo={handleClickEditBillingInfo}
                        paymentLoading={paymentLoading}
                        premiumStatus={premiumStatus}
                        seats={selectedSeatsQty}
                        setPaymentLoading={setPaymentLoading}
                        setPaymentMethodType={setPaymentMethodType}
                      />
                      {billingCountry !== "US" && (
                        <VatNumber isInAccountSummary={false} />
                      )}
                    </Flex>
                  </div>
                  <Flex
                    flexDirection="column"
                    gap="16px"
                    sx={{ width: "460px" }}
                  >
                    <OrderSummary
                      billingCountry={billingCountry}
                      handleClickAddBillingInfo={handleClickAddBillingInfo}
                      numberOfMembers={numberOfMembers}
                      paymentMethodType={paymentMethodType}
                      selectedOffer={selectedOffer}
                      selectedSeatsQty={selectedSeatsQty}
                      setErrorMessage={setErrorMessage}
                      setOrderSummaryData={setOrderSummaryData}
                      setPostTrialCheckoutState={setPostTrialCheckoutState}
                      setSelectedSeatsQty={setSelectedSeatsQty}
                    />
                    <Questions />
                  </Flex>
                </Flex>
              </Flex>
            </>
          );
  };
  const renderSuccess = () => {
    return shouldShowLoader
      ? renderLoader()
      : postTrialCheckoutState === PostTrialCheckoutState.SUCCESS &&
          orderSummaryData &&
          selectedOffer && (
            <Flex flexDirection="row" gap="16px" sx={{ padding: "32px 0" }}>
              <Flex flexDirection="column" gap="16px">
                <Card sx={{ width: "646px", padding: "24px" }}>
                  <Flex flexDirection="column" gap="16px">
                    <Flex flexDirection="column" gap="16px" alignItems="center">
                      <img
                        sx={{
                          maxWidth: "60%",
                          aspectRatio: "3/2",
                        }}
                        src={
                          colorMode === "light"
                            ? WhySecurityTeamsAreImportantLight
                            : WhySecurityTeamsAreImportantDark
                        }
                        alt={translate(I18N_KEYS.SUCCESS_IMG_ALT)}
                      />
                      <Badge
                        iconName="FeedbackSuccessOutlined"
                        label={translate(I18N_KEYS.SUCCESS_BADGE_LABEL)}
                        mood="positive"
                        layout="iconLeading"
                      />
                      <Heading
                        as="h2"
                        textStyle="ds.title.section.large"
                        color="ds.text.neutral.catchy"
                      >
                        {translate(I18N_KEYS.SUCCESS_HEADING)}
                      </Heading>
                      <Paragraph
                        textStyle="ds.body.standard.regular"
                        color="ds.text.neutral.standard"
                        sx={{ textAlign: "center", maxWidth: "440px" }}
                      >
                        {translate(I18N_KEYS.SUCCESS_DESCRIPTION)}
                      </Paragraph>
                      <Flex
                        flexDirection="row"
                        gap="32px"
                        sx={{ margin: "16px 0 32px" }}
                      >
                        <Button
                          onClick={() => {
                            history.push(routes.teamMembersRoutePath);
                          }}
                          mood="brand"
                          intensity="catchy"
                          layout="iconTrailing"
                          icon="ArrowRightOutlined"
                        >
                          {translate(
                            I18N_KEYS.SUCCESS_BUTTON_START_INVITING_USERS
                          )}
                        </Button>
                        <Button
                          onClick={() => {
                            history.push(routes.teamAccountRoutePath);
                          }}
                          mood="brand"
                          intensity="quiet"
                          layout="iconTrailing"
                          icon="ArrowRightOutlined"
                        >
                          {translate(
                            I18N_KEYS.SUCCESS_BUTTON_REVIEW_YOUR_SUBSCRIPTION
                          )}
                        </Button>
                      </Flex>
                    </Flex>
                  </Flex>
                </Card>
              </Flex>
              <Flex flexDirection="column">
                <OrderSummarySuccess
                  billingCountry={billingCountry}
                  orderSummaryData={orderSummaryData}
                  selectedOffer={selectedOffer}
                />
              </Flex>
            </Flex>
          );
  };
  return (
    <Flex
      flexDirection="column"
      sx={{ margin: "0 24px 24px", width: "1285px" }}
    >
      {renderForm()}
      {renderSuccess()}
    </Flex>
  );
};
