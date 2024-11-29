import { useEffect } from "react";
import {
  Flex,
  Icon,
  IndeterminateLoader,
  Paragraph,
} from "@dashlane/design-system";
import { Offer, SpaceTier } from "@dashlane/team-admin-contracts";
import { SpinnerInput } from "../../../../libs/dashlane-style/spinner-input/spinner-input";
import useTranslate from "../../../../libs/i18n/useTranslate";
import { HorizontalRule } from "../../components/HorizontalRule";
import { UseMidCycleTierUpgradeOutput } from "../../hooks/useMidCycleTierUpgrade";
import { Row } from "../../components/row";
import { useBillingCountry } from "../../../helpers/useBillingCountry";
import { AmountFeedback } from "./amount-feedback";
interface OrderSummaryBodyProps {
  costData: UseMidCycleTierUpgradeOutput["costData"];
  currency: string | undefined;
  currentSpaceTier: SpaceTier;
  isProratedDiscountLoading: boolean;
  isTaxLoading: boolean;
  isAmountAllowed: boolean;
  selectedOffer?: Offer;
  setSelectedSeatsQty: (newSelectedSeatsQty: number) => void;
  signalAmountValidHandler: (info: boolean) => void;
}
const MINIMUM_SEAT_PURCHASE_QTY = 2;
const DEFAULT_SEATS_STARTER = 10;
export const OrderSummaryBody = ({
  costData,
  currency,
  currentSpaceTier,
  isProratedDiscountLoading,
  isAmountAllowed,
  isTaxLoading,
  selectedOffer,
  setSelectedSeatsQty,
  signalAmountValidHandler,
}: OrderSummaryBodyProps) => {
  const { translate } = useTranslate();
  const { loading, billingCountry } = useBillingCountry();
  const spinnerInputDefaultValue =
    currentSpaceTier === SpaceTier.Starter
      ? DEFAULT_SEATS_STARTER
      : costData.currentSeats;
  useEffect(() => {
    setSelectedSeatsQty(spinnerInputDefaultValue);
  }, [spinnerInputDefaultValue]);
  if (loading) {
    return <IndeterminateLoader />;
  }
  const spinnerInputMinValue =
    currentSpaceTier === SpaceTier.Starter ||
    currentSpaceTier === SpaceTier.Standard
      ? costData.currentActiveSeats > MINIMUM_SEAT_PURCHASE_QTY
        ? costData.currentActiveSeats
        : MINIMUM_SEAT_PURCHASE_QTY
      : costData.currentSeats;
  const taxCopy =
    billingCountry === "US"
      ? "team_account_teamplan_changeplan_order_summary_tax"
      : "team_account_teamplan_vat";
  const showMinimumSeatInfo =
    costData.totalSeats === costData.currentActiveSeats || !isAmountAllowed;
  return (
    <>
      {selectedOffer && currency ? (
        <>
          <Row
            label={
              <Paragraph textStyle="ds.body.standard.strong">
                {translate(
                  "team_account_teamplan_changeplan_order_summary_seats_total",
                  {
                    totalSeats: costData.totalSeats,
                  }
                )}
              </Paragraph>
            }
            value={
              <div sx={{ width: "146px" }}>
                <SpinnerInput
                  id="test"
                  inputWidth="66px"
                  label=""
                  ariaLabel={translate(
                    "team_account_teamplan_upgrade_premium_number_of_seats_free_to_paid"
                  )}
                  minValue={spinnerInputMinValue}
                  onChange={setSelectedSeatsQty}
                  signalAmountValidHandler={signalAmountValidHandler}
                  defaultValue={spinnerInputDefaultValue}
                />
              </div>
            }
          />
          {showMinimumSeatInfo ? (
            <AmountFeedback
              isAmountAllowed={isAmountAllowed}
              absoluteMinimum={MINIMUM_SEAT_PURCHASE_QTY}
              relativeMinimum={spinnerInputMinValue}
            />
          ) : null}
          <Row
            label={
              <Paragraph textStyle="ds.body.standard.strong">
                {translate(
                  "team_account_teamplan_changeplan_order_summary_seats_upgraded",
                  {
                    upgradedSeats: Math.min(
                      costData.currentSeats,
                      costData.totalSeats
                    ),
                  }
                )}
              </Paragraph>
            }
            value={
              <Paragraph textStyle="ds.body.standard.strong">
                {translate.price(currency, costData.upgradedSeatsPrice / 100)}
              </Paragraph>
            }
          />
          {costData.addedSeats ? (
            <Row
              label={
                <Paragraph textStyle="ds.body.standard.strong">
                  {translate(
                    "team_account_teamplan_changeplan_order_summary_seats_new",
                    {
                      newSeats: costData.addedSeats,
                    }
                  )}
                </Paragraph>
              }
              value={
                <Paragraph textStyle="ds.body.standard.strong">
                  {translate.price(currency, costData.addedSeatsPrice / 100)}
                </Paragraph>
              }
            />
          ) : null}

          <HorizontalRule />

          <Row
            label={
              <Paragraph textStyle="ds.body.standard.strong">
                {translate(
                  "team_account_teamplan_changeplan_order_summary_subtotal"
                )}
              </Paragraph>
            }
            value={
              currency ? (
                <Paragraph textStyle="ds.body.standard.strong">
                  {translate.price(currency, costData.subtotal / 100)}
                </Paragraph>
              ) : null
            }
          />
          {costData?.proratedDiscount ? (
            <Row
              label={
                <Flex alignItems="center" gap="5px">
                  <Paragraph color="ds.text.neutral.quiet">
                    {translate(
                      "team_account_teamplan_changeplan_order_summary_prorated_discount"
                    )}
                  </Paragraph>
                  <Icon
                    color="ds.text.neutral.quiet"
                    name="FeedbackInfoOutlined"
                    size="small"
                    tooltip={translate(
                      "team_account_teamplan_changeplan_order_summary_prorated_discount_tooltip"
                    )}
                  />
                </Flex>
              }
              value={
                isProratedDiscountLoading ? (
                  <IndeterminateLoader mood="neutral" size={13} />
                ) : costData.proratedDiscount && currency ? (
                  <Paragraph color="ds.text.neutral.quiet">
                    {translate.price(currency, costData.proratedDiscount / 100)}
                  </Paragraph>
                ) : null
              }
            />
          ) : null}
          {costData.tax ? (
            <Row
              label={
                <Paragraph color="ds.text.neutral.quiet">
                  {translate(taxCopy)}
                </Paragraph>
              }
              value={
                isTaxLoading ? (
                  <IndeterminateLoader mood="neutral" size={13} />
                ) : (
                  <Paragraph color="ds.text.neutral.quiet">
                    {translate.price(currency, costData.tax / 100)}
                  </Paragraph>
                )
              }
            />
          ) : null}
        </>
      ) : null}
    </>
  );
};
