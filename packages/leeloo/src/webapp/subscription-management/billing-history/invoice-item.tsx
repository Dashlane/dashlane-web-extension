import { fromUnixTime } from "date-fns";
import { Button, Flex, Paragraph } from "@dashlane/design-system";
import { Invoice } from "@dashlane/communication";
import { LocaleFormat } from "../../../libs/i18n/helpers";
import useTranslate from "../../../libs/i18n/useTranslate";
import Row from "../../list-view/row";
import styles from "./invoice.css";
const I18N_KEYS = {
  BTN_ADD_DETAILS:
    "manage_subscription_billing_section_table_add_details_button",
  ORDER_NUM: "manage_subscription_billing_section_table_order",
  DOWNLOAD_INVOICE: "team_account_billing_date_cta_invoice",
  PREMIUM: "manage_subscription_plan_name_premium",
  PREMIUM_PLUS: "manage_subscription_plan_name_premium_plus",
  ADVANCED: "manage_subscription_plan_name_advanced",
  ESSENTIAL: "manage_subscription_plan_name_essentials",
  FAMILY_PLAN: "manage_subscription_plan_name_family",
  DEFAULT_CAT: "default_category_name_other",
  MONTHLY: "manage_subscription_billing_section_table_duration_monthly",
  ANNUAL: "manage_subscription_billing_section_table_duration_annual",
};
export interface InvoiceItemProps {
  invoice: Invoice;
  onDownloadInvoiceRequested: (invoice: Invoice) => void;
  onCustomizeInvoiceRequested: (invoice: Invoice) => void;
}
const getPlanStringFromInvoice = (invoice: Invoice): string => {
  if (invoice.planFeature === "premiumplus") {
    return I18N_KEYS.PREMIUM_PLUS;
  } else if (invoice.planFeature === "advanced") {
    return I18N_KEYS.ADVANCED;
  } else if (invoice.planFeature === "essentials") {
    return I18N_KEYS.ESSENTIAL;
  } else if (["family_created", "family_renewed"].includes(invoice.eventType)) {
    return I18N_KEYS.FAMILY_PLAN;
  } else if (invoice.planFeature === "sync") {
    return I18N_KEYS.PREMIUM;
  } else {
    return I18N_KEYS.DEFAULT_CAT;
  }
};
export const InvoiceItem = ({
  invoice,
  onDownloadInvoiceRequested,
  onCustomizeInvoiceRequested,
}: InvoiceItemProps) => {
  const { translate } = useTranslate();
  const { amountPaid, currency, duration, invoiceId, startDate } = invoice;
  const price = translate.price(currency, amountPaid / 100);
  const formatDate = (serverDate: number) => {
    return translate.shortDate(fromUnixTime(serverDate), LocaleFormat.LL);
  };
  const planNameString = getPlanStringFromInvoice(invoice);
  const isMonthly = duration.includes("M-");
  const periodicityString = isMonthly ? I18N_KEYS.MONTHLY : I18N_KEYS.ANNUAL;
  const invoiceLabelText = `${translate(planNameString)} (${translate(
    periodicityString
  )})`;
  const rowData = [
    {
      key: "planDuration",
      content: (
        <Flex flexDirection="column" sx={{ padding: "12px 0" }}>
          <Paragraph color="ds.text.neutral.catchy">
            {invoiceLabelText}
          </Paragraph>
          <Paragraph
            textStyle="ds.body.reduced.regular"
            color="ds.text.neutral.quiet"
          >
            {translate(I18N_KEYS.ORDER_NUM, {
              order: invoiceId,
            })}
          </Paragraph>
        </Flex>
      ),
      className: styles.invoiceListColumn,
    },
    {
      key: "startDate",
      content: (
        <Paragraph
          textStyle="ds.body.reduced.regular"
          color="ds.text.neutral.quiet"
        >
          {formatDate(startDate)}
        </Paragraph>
      ),
      className: styles.invoiceListColumn,
    },
    {
      key: "price",
      content: (
        <Paragraph
          textStyle="ds.body.reduced.regular"
          color="ds.text.neutral.quiet"
        >
          {price}
        </Paragraph>
      ),
      className: styles.invoiceListColumn,
    },
    {
      key: "button",
      content: (
        <div sx={{ display: "flex", gap: "10px" }}>
          <Button
            intensity="quiet"
            mood="neutral"
            size="small"
            onClick={() => onCustomizeInvoiceRequested(invoice)}
          >
            {translate(I18N_KEYS.BTN_ADD_DETAILS)}
          </Button>
          <Button
            layout="iconOnly"
            onClick={() => onDownloadInvoiceRequested(invoice)}
            aria-label={translate(I18N_KEYS.DOWNLOAD_INVOICE)}
            icon="DownloadOutlined"
            size="small"
          />
        </div>
      ),
      className: styles.invoiceListColumn,
    },
  ];
  return <Row style={{ padding: "0px", minHeight: "unset" }} data={rowData} />;
};
