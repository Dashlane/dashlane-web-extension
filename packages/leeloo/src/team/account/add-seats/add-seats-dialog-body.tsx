import { useState } from "react";
import { Button, Card, Flex, Icon, Infobox } from "@dashlane/design-system";
import {
  colors,
  InfoCircleIcon,
  Paragraph,
  ThemeUIStyleObject,
  Tooltip,
} from "@dashlane/ui-components";
import { SpinnerInput } from "../../../libs/dashlane-style/spinner-input/spinner-input";
import useTranslate from "../../../libs/i18n/useTranslate";
import { LocaleFormat } from "../../../libs/i18n/helpers";
import { Mode, PaymentLoading } from "../../../libs/billing/PaymentLoading";
import { PaymentMethodDetails } from "../../../webapp/subscription-management/payment-method/payment-method-details";
import { ComputedPrice } from "./computed-price";
import { useCreditCardPaymentMethodDisplay } from "../upgrade-success/useCreditCardPaymentDisplay";
import { BillingDetails } from "./add-seats-wrapper";
import { HorizontalRule } from "../../change-plan/components/HorizontalRule";
import { CostDetailsForTier } from "./teamPlanCalculator";
import { useBillingSeatDetails } from "./useBillingSeatDetails";
import styles from "./styles.css";
const I18N_KEYS = {
  NUMBER_OF_SEATS: "team_account_teamplan_upgrade_premium_number_of_seats",
  NEW_SEAT: "team_account_teamplan_upgrade_new_seat",
  TAX: "team_account_teamplan_upgrade_tax",
  PRORATED_DISCOUNT:
    "team_account_teamplan_changeplan_order_summary_prorated_discount",
  PRORATED_DISCOUNT_TOOLTIP:
    "team_account_teamplan_changeplan_order_summary_prorated_discount_tooltip",
  RENEWAL_PRICE: "team_account_teamplan_upgrade_renewal_price",
  RENEWAL_TAX_PRICE: "team_account_teamplan_upgrade_renewal_tax_price",
  RENEWAL_VAT_PRICE: "team_account_teamplan_upgrade_renewal_vat_price",
  INVOICE_RENEWAL_PRICE: "team_account_teamplan_upgrade_invoice_renewal_price",
  PAY_TODAY: "team_account_teamplan_upgrade_due_now",
  VAT: "team_account_teamplan_vat",
};
const flexContainerStyles: ThemeUIStyleObject = {
  margin: "24px 0",
  color: "ds.text.neutral.standard",
};
interface RowProps {
  label?: React.ReactNode;
  labelSx?: ThemeUIStyleObject;
  value?: React.ReactNode;
}
const Row = ({ label, labelSx, value }: RowProps) => {
  return (
    <Flex sx={flexContainerStyles}>
      {label ? <div sx={{ ...labelSx, flex: 1 }}>{label}</div> : null}
      {value ? <div sx={{ flex: 0 }}>{value}</div> : null}
    </Flex>
  );
};
export interface Props {
  nextBillingDate: Date;
  billingDetails: BillingDetails;
  dueNowTranslation: string;
  seatCountLabel: string;
  totalSeatCount: number;
  onAdditionalSeatCountChange: (seats: number) => void;
  isComputingBilling: boolean;
  additionalSeatsDetails: CostDetailsForTier[];
  planType: string | undefined;
  billingCountry: string;
  initialAdditionalSeatCount: number;
}
export const AddSeatsDialogBody = ({
  nextBillingDate,
  billingDetails,
  dueNowTranslation,
  seatCountLabel,
  totalSeatCount,
  onAdditionalSeatCountChange,
  isComputingBilling,
  additionalSeatsDetails,
  planType,
  billingCountry,
  initialAdditionalSeatCount,
}: Props) => {
  const { translate } = useTranslate();
  const {
    additionalSeatsCount,
    additionalSeatsTaxesTranslation,
    hasTax,
    renewalTotalPrice,
    tierPriceTranslation,
    proratedDiscountTranslation,
    hasProratedDiscount,
  } = useBillingSeatDetails({
    billingDetails,
    additionalSeatsDetails,
  });
  const { pollUntilCardUpdate } = useCreditCardPaymentMethodDisplay({});
  const [paymentLoading, setPaymentLoading] = useState(false);
  const hasInvoicePlanType = planType === "invoice";
  const taxCopy = billingCountry === "US" ? I18N_KEYS.TAX : I18N_KEYS.VAT;
  const renewalTaxCopy =
    billingCountry === "US"
      ? I18N_KEYS.RENEWAL_TAX_PRICE
      : I18N_KEYS.RENEWAL_VAT_PRICE;
  const renewalCopy = hasTax ? renewalTaxCopy : I18N_KEYS.RENEWAL_PRICE;
  const renewalPrice = hasInvoicePlanType
    ? I18N_KEYS.INVOICE_RENEWAL_PRICE
    : renewalCopy;
  return (
    <>
      <Flex
        sx={{
          padding: "28px 0",
          fontSize: 4,
          fontWeight: "bold",
          color: "ds.text.neutral.catchy",
        }}
      >
        <SpinnerInput
          inputWidth="66px"
          label={seatCountLabel}
          id="numberOfSeats"
          defaultValue={initialAdditionalSeatCount}
          minValue={1}
          onChange={onAdditionalSeatCountChange}
        />
      </Flex>

      <HorizontalRule />

      <Row
        label={translate(I18N_KEYS.NUMBER_OF_SEATS)}
        value={totalSeatCount}
      />

      <Row
        label={translate(I18N_KEYS.NEW_SEAT, {
          count: additionalSeatsCount,
        })}
        value={tierPriceTranslation}
      />

      {hasTax && (
        <Row
          label={translate(taxCopy)}
          value={additionalSeatsTaxesTranslation}
        />
      )}

      {hasProratedDiscount && (
        <Row
          label={
            <>
              <Paragraph>{translate(I18N_KEYS.PRORATED_DISCOUNT)}</Paragraph>

              <Tooltip content={translate(I18N_KEYS.PRORATED_DISCOUNT_TOOLTIP)}>
                <InfoCircleIcon size={16} color={colors.grey00} />
              </Tooltip>
            </>
          }
          labelSx={{ display: "flex", alignItems: "center" }}
          value={proratedDiscountTranslation}
        />
      )}

      <>
        <HorizontalRule />
        <Paragraph sx={{ margin: "24px 0", fontSize: "18px" }}>
          {translate("team_payment_method_dialog_credit_card")}
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
            onClick={() => {
              pollUntilCardUpdate();
              setPaymentLoading(true);
            }}
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
      </>

      <Flex sx={flexContainerStyles}>
        <Infobox
          title={translate(renewalPrice, {
            totalPrice: renewalTotalPrice,
            totalSeat: totalSeatCount,
            date: translate.shortDate(nextBillingDate, LocaleFormat.LL),
          })}
        />
      </Flex>

      <HorizontalRule />

      <Flex sx={{ marginTop: "24px", fontSize: 4 }}>
        <div sx={{ flex: 1 }}>{translate(I18N_KEYS.PAY_TODAY)}</div>
        <ComputedPrice
          isComputing={isComputingBilling}
          price={dueNowTranslation}
          className={styles.totalAmount}
        />
      </Flex>
    </>
  );
};
