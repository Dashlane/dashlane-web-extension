import { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import {
  Flex,
  Icon,
  LinkButton,
  Paragraph,
  ThemeUIStyleObject,
} from "@dashlane/design-system";
import { Offer } from "@dashlane/team-admin-contracts";
import useTranslate from "../../../../libs/i18n/useTranslate";
import { getSeatPrices, isOfferBusinessTier } from "../../../change-plan/utils";
import { SpinnerInput } from "../../../../libs/dashlane-style/spinner-input/spinner-input";
import { useRouterGlobalSettingsContext } from "../../../../libs/router";
import { MINIMUM_SEAT_PURCHASE_QTY } from "../..";
const planHeaderStyles: ThemeUIStyleObject = {
  display: "flex",
  alignItems: "center",
  padding: "12px 8px",
  borderRadius: "8px",
  justifyContent: "space-between",
  backgroundColor: "ds.container.agnostic.neutral.quiet",
};
const I18N_KEYS = {
  NUMBER_OF_SEATS: "team_post_trial_checkout_number_of_seats",
  NUMBER_OF_SEATS_TOOLTIP: "team_post_trial_checkout_number_of_seats_tooltip",
  NUMBER_OF_SEATS_TOOLTIP_PLAN_MINIMUM:
    "team_post_trial_checkout_number_of_seats_tooltip_plan_minimum",
  MINIMUM_USERS: "team_post_trial_checkout_minimum_users",
  ORDER_SUMMARY_SEAT_YEAR: "team_post_trial_checkout_order_summary_seat_year",
  PLANS_BUSINESS_NAME: "team_account_teamplan_changeplan_plans_business_name",
  PLANS_STANDARD_NAME: "manage_subscription_plan_name_dashlane_standard",
  REVIEW_ACTIVE_USERS: "team_post_trial_checkout_review_active_users",
  SELECT_PLAN: "team_account_teamplan_changeplan_order_summary_select_plan",
  STANDARD_ORDER_SUMMARY_SEAT_YEAR:
    "team_post_trial_checkout_standard_order_summary_seat_year",
};
const DEFAULT_SEATS_STANDARD = 10;
interface HeaderProps {
  numberOfMembers: number;
  planPrice: number;
  selectedOffer?: Offer;
  selectedSeatsQty: number;
  setPlanPrice: (selectedPlanPrice: number) => void;
  setSelectedSeatsQty: (newSelectedSeatsQty: number) => void;
  setIsSeatsQtyValid: (isValid: boolean) => void;
}
export const OrderSummaryHeader = ({
  numberOfMembers,
  planPrice,
  selectedOffer,
  selectedSeatsQty,
  setPlanPrice,
  setSelectedSeatsQty,
  setIsSeatsQtyValid,
}: HeaderProps) => {
  const { translate } = useTranslate();
  const history = useHistory();
  const { routes } = useRouterGlobalSettingsContext();
  const spinnerInputMinValue =
    numberOfMembers > MINIMUM_SEAT_PURCHASE_QTY
      ? numberOfMembers
      : MINIMUM_SEAT_PURCHASE_QTY;
  const [businessSeatsCache, setBusinessSeatsCache] = useState(
    Math.max(selectedSeatsQty, spinnerInputMinValue)
  );
  useEffect(() => {
    if (selectedOffer) {
      const seatPrices = getSeatPrices({
        offer: selectedOffer,
      });
      const seatPrice = seatPrices.equivalentPrice;
      setPlanPrice(seatPrice);
      if (isOfferBusinessTier(selectedOffer)) {
        setSelectedSeatsQty(businessSeatsCache);
      } else {
        if (selectedSeatsQty !== DEFAULT_SEATS_STANDARD) {
          setBusinessSeatsCache(selectedSeatsQty);
        }
        setSelectedSeatsQty(DEFAULT_SEATS_STANDARD);
      }
    }
  }, [selectedOffer]);
  const handleSeatsChange = (newValue: number) => {
    setSelectedSeatsQty(newValue);
    setBusinessSeatsCache(newValue);
    if (newValue < spinnerInputMinValue) {
      setIsSeatsQtyValid(false);
    } else {
      setIsSeatsQtyValid(true);
    }
  };
  if (!selectedOffer) {
    return (
      <div sx={planHeaderStyles}>
        <Paragraph
          textStyle="ds.body.standard.strong"
          color="ds.text.brand.quiet"
        >
          {translate(I18N_KEYS.SELECT_PLAN)}
        </Paragraph>
      </div>
    );
  }
  const currency = selectedOffer.currency;
  const standardSeatPrice = planPrice * DEFAULT_SEATS_STANDARD;
  const headerData = isOfferBusinessTier(selectedOffer)
    ? {
        planName: translate(I18N_KEYS.PLANS_BUSINESS_NAME),
        planPrice: translate(I18N_KEYS.ORDER_SUMMARY_SEAT_YEAR, {
          cost: translate.price(currency, planPrice / 100, {
            notation: "compact",
          }),
        }),
      }
    : {
        planName: translate(I18N_KEYS.PLANS_STANDARD_NAME),
        planPrice: translate(I18N_KEYS.STANDARD_ORDER_SUMMARY_SEAT_YEAR, {
          cost: translate.price(currency, standardSeatPrice / 100, {
            notation: "compact",
          }),
        }),
      };
  return (
    <>
      <div sx={planHeaderStyles}>
        <Paragraph
          textStyle="ds.body.standard.strong"
          color="ds.text.brand.quiet"
        >
          {headerData.planName}
        </Paragraph>
        <Paragraph
          textStyle="ds.body.standard.strong"
          color="ds.text.brand.quiet"
        >
          {headerData.planPrice}
        </Paragraph>
      </div>
      <Flex
        justifyContent="flex-end"
        sx={{
          padding: isOfferBusinessTier(selectedOffer)
            ? "0 10px"
            : "16px 10px 8px",
        }}
      >
        <div sx={{ display: "flex", alignItems: "center", flex: 1 }}>
          <Paragraph
            textStyle="ds.body.standard.strong"
            color="ds.text.neutral.catchy"
          >
            {translate(I18N_KEYS.NUMBER_OF_SEATS)}
          </Paragraph>
        </div>
        <div sx={{ display: "flex", alignItems: "center" }}>
          <div sx={{ width: "146px" }}>
            {isOfferBusinessTier(selectedOffer) ? (
              <SpinnerInput
                key={`seats-${selectedSeatsQty}`}
                id="checkoutNumberOfSeats"
                inputWidth="66px"
                label=""
                ariaLabel={translate(I18N_KEYS.NUMBER_OF_SEATS)}
                minValue={spinnerInputMinValue}
                onChange={handleSeatsChange}
                defaultValue={selectedSeatsQty}
              />
            ) : (
              <div id="standard-seats" sx={{ float: "right" }}>
                <Paragraph
                  textStyle="ds.body.standard.strong"
                  color="ds.text.neutral.catchy"
                >
                  {DEFAULT_SEATS_STANDARD}
                </Paragraph>
              </div>
            )}
          </div>
        </div>
      </Flex>
      {isOfferBusinessTier(selectedOffer) &&
        selectedSeatsQty <= spinnerInputMinValue && (
          <Flex
            justifyContent="flex-end"
            sx={{
              padding: "0 10px",
            }}
          >
            <Flex flexDirection="row" alignItems="center" sx={{ flex: 1 }}>
              <Paragraph
                textStyle="ds.body.reduced.regular"
                color={
                  selectedSeatsQty < spinnerInputMinValue
                    ? "ds.text.danger.quiet"
                    : "ds.text.neutral.quiet"
                }
              >
                <Flex flexDirection="row" alignItems="center" gap="4px">
                  {translate(I18N_KEYS.MINIMUM_USERS, {
                    numberOfMembers: spinnerInputMinValue,
                  })}
                  <Icon
                    color={
                      selectedSeatsQty < spinnerInputMinValue
                        ? "ds.text.danger.quiet"
                        : "ds.text.neutral.quiet"
                    }
                    name="FeedbackInfoOutlined"
                    tooltip={{
                      content:
                        numberOfMembers > MINIMUM_SEAT_PURCHASE_QTY
                          ? translate(I18N_KEYS.NUMBER_OF_SEATS_TOOLTIP)
                          : translate(
                              I18N_KEYS.NUMBER_OF_SEATS_TOOLTIP_PLAN_MINIMUM,
                              { minNumOfSeats: MINIMUM_SEAT_PURCHASE_QTY }
                            ),
                    }}
                  />
                </Flex>
              </Paragraph>
            </Flex>
            {numberOfMembers > MINIMUM_SEAT_PURCHASE_QTY && (
              <Flex flexDirection="row" alignItems="center">
                <LinkButton
                  onClick={() => history.push(routes.teamMembersRoutePath)}
                >
                  {translate(I18N_KEYS.REVIEW_ACTIVE_USERS)}
                </LinkButton>
              </Flex>
            )}
          </Flex>
        )}
    </>
  );
};
