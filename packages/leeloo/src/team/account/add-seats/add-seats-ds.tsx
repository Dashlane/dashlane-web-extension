import { useEffect, useState } from "react";
import { fromUnixTime } from "date-fns";
import {
  Button,
  Card,
  Dialog,
  Flex,
  Icon,
  IndeterminateLoader,
  Infobox,
  Paragraph,
} from "@dashlane/design-system";
import {
  BillingMethod,
  GetPlanPricingDetailsResult,
  teamPlanDetailsApi,
  teamPlanUpdateApi,
} from "@dashlane/team-admin-contracts";
import {
  DataStatus,
  useModuleCommands,
  useModuleQuery,
} from "@dashlane/framework-react";
import { isSuccess } from "@dashlane/framework-types";
import useTranslate from "../../../libs/i18n/useTranslate";
import { SpinnerInput } from "../../../libs/dashlane-style/spinner-input/spinner-input";
import { Mode, PaymentLoading } from "../../../libs/billing/PaymentLoading";
import { useTeamBillingInformation } from "../../../libs/hooks/use-team-billing-information";
import { LocaleFormat } from "../../../libs/i18n/helpers";
import { PaymentMethodDetails } from "../../../webapp/subscription-management/payment-method/payment-method-details";
import { Divider } from "../components/divider";
import { useBillingCountry } from "../../helpers/useBillingCountry";
import { ADDITIONAL_SEAT_CAP, getLocalizedPlanTier } from "./helpers";
import { useCreditCardPaymentMethodDisplay } from "../upgrade-success/useCreditCardPaymentDisplay";
import {
  CostDetailsForTier,
  getAdditionalSeatsCostDetails,
} from "./teamPlanCalculator";
import { AddSeatsProcessingModal } from "./add-seats-processing-modal";
const I18N_KEYS = {
  NUMBER_OF_SEATS:
    "team_account_teamplan_upgrade_premium_number_of_additional_seats",
  TOTAL_NUMBER_SEATS: "team_account_teamplan_upgrade_premium_number_of_seats",
  NEW_SEATS_COUNT: "team_account_teamplan_upgrade_new_seat",
  VAT: "team_account_teamplan_vat",
  TAX: "team_account_teamplan_upgrade_tax",
  PRORATED_DISCOUNT:
    "team_account_teamplan_changeplan_order_summary_prorated_discount",
  CREDIT_CARD: "team_payment_method_dialog_credit_card",
  DUE_NOW: "team_account_teamplan_upgrade_due_now",
  ADD_SEATS_TITLE: "team_account_teamplan_upgrade_add_seats_title",
  BUY_SEAT: "team_account_teamplan_upgrade_buy_seat",
  CANCEL: "team_account_teamplan_upgrade_premium_cancel",
  BUTTON_CLOSE_DIALOG: "_common_dialog_dismiss_button",
  RENEWAL_TAX_PRICE: "team_account_teamplan_upgrade_renewal_tax_price",
  RENEWAL_VAT_PRICE: "team_account_teamplan_upgrade_renewal_vat_price",
  RENEWAL_PRICE: "team_account_teamplan_upgrade_renewal_price",
  INVOICE_RENEWAL_PRICE: "team_account_teamplan_upgrade_invoice_renewal_price",
  PRORATED_DISCOUNT_TOOLTIP:
    "team_account_teamplan_changeplan_order_summary_prorated_discount_tooltip",
};
interface Props {
  numberOfCurrentPaidSlots: number;
  prefilledNumberOfSeatsToBuy?: number;
  onClose: () => void;
  onUpgradeSuccess: (
    additionalSeatsDetails: CostDetailsForTier[],
    billingDetails: GetPlanPricingDetailsResult
  ) => void;
}
export const AddSeatsNG = ({
  numberOfCurrentPaidSlots,
  onClose,
  onUpgradeSuccess,
  prefilledNumberOfSeatsToBuy,
}: Props) => {
  const { translate } = useTranslate();
  const teamBillingInformation = useTeamBillingInformation();
  const planPricingDetailsQuery = useModuleQuery(
    teamPlanUpdateApi,
    "getPlanPricingDetails"
  );
  const { computePlanPricingDetails } = useModuleCommands(teamPlanUpdateApi);
  const { addSeats } = useModuleCommands(teamPlanDetailsApi);
  const { pollUntilCardUpdate } = useCreditCardPaymentMethodDisplay({});
  const { billingCountry } = useBillingCountry();
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [additionalSeatsCount, setAdditionalSeatsCount] = useState<number>(
    prefilledNumberOfSeatsToBuy ?? 1
  );
  const [isSeatCountAboveCap, setIsSeatCountAboveCap] = useState(false);
  const [isLoadingOpen, setIsLoadingOpen] = useState(false);
  const isDataLoading = planPricingDetailsQuery.status === DataStatus.Loading;
  useEffect(() => {
    computePlanPricingDetails({ numberOfSeats: additionalSeatsCount });
  }, [additionalSeatsCount]);
  if (
    !teamBillingInformation ||
    !billingCountry ||
    planPricingDetailsQuery.status === DataStatus.Error ||
    !planPricingDetailsQuery.data
  ) {
    return null;
  }
  const { spaceTier, nextBillingDetails, billingType, planDetails } =
    teamBillingInformation;
  const { renewal, additionalSeats, currency } = planPricingDetailsQuery.data;
  const nextBillingDate = fromUnixTime(nextBillingDetails.dateUnix);
  const planName = getLocalizedPlanTier(spaceTier, translate);
  const additionalSeatsCostDetails: CostDetailsForTier[] =
    getAdditionalSeatsCostDetails(
      numberOfCurrentPaidSlots,
      renewal.seatsCount,
      planDetails.priceRanges
    );
  const totalSeatCount = numberOfCurrentPaidSlots + additionalSeatsCount;
  const additionalSeatsTaxes = additionalSeats.taxes ?? 0;
  const tierPrice =
    additionalSeatsCostDetails.reduce((sum, tier) => {
      return sum + tier.costPerSeat * tier.numberOfSeats;
    }, 0) * 100;
  const tierPriceTranslation = translate.price(currency, tierPrice / 100);
  const hasTax = !!additionalSeats.taxes;
  const renewalTaxCopy =
    billingCountry === "US"
      ? I18N_KEYS.RENEWAL_TAX_PRICE
      : I18N_KEYS.RENEWAL_VAT_PRICE;
  const renewalCopy = hasTax ? renewalTaxCopy : I18N_KEYS.RENEWAL_PRICE;
  const additionalSeatsTaxesTranslation = translate.price(
    currency,
    additionalSeatsTaxes / 100
  );
  const renewalPrice =
    billingType === BillingMethod.Invoice
      ? I18N_KEYS.INVOICE_RENEWAL_PRICE
      : renewalCopy;
  const proratedDiscount = tierPrice - additionalSeats.value;
  const proratedDiscountTranslation = translate.price(
    currency,
    proratedDiscount / 100
  );
  const renewalTotal = renewal.value + (renewal.taxes ?? 0);
  const renewalTotalPrice = translate.price(currency, renewalTotal / 100);
  const seatsPrice = additionalSeats.value + additionalSeatsTaxes;
  const dueNow = isSeatCountAboveCap
    ? "-"
    : translate.price(currency, seatsPrice / 100);
  const hasProratedDiscount = proratedDiscount > 0;
  const onChangeAdditionalSeats = async (seats: number) => {
    const newSeatCountBelowMinimum = seats < 0;
    const newSeatCountAboveCap = seats > ADDITIONAL_SEAT_CAP;
    setIsSeatCountAboveCap(newSeatCountAboveCap);
    if (newSeatCountAboveCap || newSeatCountBelowMinimum) {
      return;
    }
    setAdditionalSeatsCount(seats);
  };
  const onClickEditPaymentCard = () => {
    pollUntilCardUpdate();
    setPaymentLoading(true);
  };
  const handleBuyMoreSeats = async () => {
    setIsLoadingOpen(true);
    const response = await addSeats({ seats: additionalSeatsCount });
    if (isSuccess(response)) {
      setIsLoadingOpen(false);
      onUpgradeSuccess(additionalSeatsCostDetails, {
        renewal,
        additionalSeats,
        currency,
      });
    }
  };
  return isLoadingOpen ? (
    <AddSeatsProcessingModal />
  ) : (
    <Dialog
      isOpen
      onClose={onClose}
      closeActionLabel={translate(I18N_KEYS.BUTTON_CLOSE_DIALOG)}
      title={translate(I18N_KEYS.ADD_SEATS_TITLE, { plan: planName })}
      actions={{
        primary: (
          <Button onClick={handleBuyMoreSeats} id="buy-seats-button">
            {translate(I18N_KEYS.BUY_SEAT, { count: additionalSeatsCount })}
          </Button>
        ),
        secondary: (
          <Button onClick={onClose}>{translate(I18N_KEYS.CANCEL)}</Button>
        ),
      }}
    >
      <Flex
        sx={{
          padding: "15px 0",
          fontSize: 4,
          fontWeight: "bold",
          color: "ds.text.neutral.catchy",
        }}
      >
        <SpinnerInput
          inputWidth="66px"
          id="numberOfSeats"
          defaultValue={prefilledNumberOfSeatsToBuy ?? 1}
          minValue={1}
          onChange={onChangeAdditionalSeats}
          label={translate(I18N_KEYS.NUMBER_OF_SEATS)}
        />
      </Flex>

      <Divider />

      <Flex gap="16px" flexDirection="column">
        <Flex justifyContent="space-between" flexDirection="row">
          <Paragraph color="ds.text.neutral.catchy">
            {translate(I18N_KEYS.TOTAL_NUMBER_SEATS)}
          </Paragraph>
          <Paragraph color="ds.text.neutral.catchy">{totalSeatCount}</Paragraph>
        </Flex>

        <Flex justifyContent="space-between" flexDirection="row">
          <Paragraph color="ds.text.neutral.catchy">
            {translate(I18N_KEYS.NEW_SEATS_COUNT, {
              count: additionalSeatsCount,
            })}
          </Paragraph>
          {isDataLoading ? (
            <IndeterminateLoader size="xsmall" />
          ) : (
            <Paragraph color="ds.text.neutral.catchy">
              {tierPriceTranslation}
            </Paragraph>
          )}
        </Flex>

        {hasTax ? (
          <Flex justifyContent="space-between" flexDirection="row">
            <Paragraph color="ds.text.neutral.catchy">
              {translate(
                billingCountry === "US" ? I18N_KEYS.TAX : I18N_KEYS.VAT
              )}
            </Paragraph>
            {isDataLoading ? (
              <IndeterminateLoader size="xsmall" />
            ) : (
              <Paragraph color="ds.text.neutral.catchy">
                {additionalSeatsTaxesTranslation}
              </Paragraph>
            )}
          </Flex>
        ) : null}

        {hasProratedDiscount ? (
          <Flex justifyContent="space-between" flexDirection="row">
            <Paragraph
              color="ds.text.neutral.catchy"
              sx={{ display: "flex", alignItems: "center", gap: "5px" }}
            >
              {translate(I18N_KEYS.PRORATED_DISCOUNT)}
              <Icon
                name="FeedbackInfoOutlined"
                tooltip={translate(I18N_KEYS.PRORATED_DISCOUNT_TOOLTIP)}
                size="xsmall"
              />
            </Paragraph>
            {isDataLoading ? (
              <IndeterminateLoader size="xsmall" />
            ) : (
              <Paragraph color="ds.text.neutral.catchy">
                {proratedDiscountTranslation}
              </Paragraph>
            )}
          </Flex>
        ) : null}
      </Flex>

      <Divider />

      <Flex gap="16px" flexDirection="column">
        <Paragraph
          textStyle="ds.title.block.medium"
          color="ds.text.neutral.catchy"
        >
          {translate(I18N_KEYS.CREDIT_CARD)}
        </Paragraph>
        <Card
          sx={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <PaymentMethodDetails
            b2c={false}
            isAppStoreUser={false}
            isGooglePlayUser={false}
          />
          <Button
            icon={<Icon name="ActionEditOutlined" />}
            layout="iconLeading"
            intensity="supershy"
            onClick={onClickEditPaymentCard}
          >
            {paymentLoading ? (
              <PaymentLoading
                b2c={false}
                setPaymentLoading={setPaymentLoading}
                mode={Mode.UPDATE}
              />
            ) : (
              translate("team_account_name_edit_label")
            )}
          </Button>
        </Card>
      </Flex>

      <Infobox
        sx={{ marginTop: "16px" }}
        mood="neutral"
        title={translate(renewalPrice, {
          totalPrice: renewalTotalPrice,
          totalSeat: totalSeatCount,
          date: translate.shortDate(nextBillingDate, LocaleFormat.LL),
        })}
      />

      <Flex
        justifyContent="space-between"
        flexDirection="row"
        sx={{ marginTop: "16px" }}
      >
        <Paragraph
          textStyle="ds.title.block.medium"
          color="ds.text.neutral.catchy"
        >
          {translate(I18N_KEYS.DUE_NOW)}
        </Paragraph>
        {isDataLoading ? (
          <IndeterminateLoader size="xsmall" />
        ) : (
          <Paragraph textStyle="ds.specialty.spotlight.small">
            {dueNow}
          </Paragraph>
        )}
      </Flex>
    </Dialog>
  );
};
