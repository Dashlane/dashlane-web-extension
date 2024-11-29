import * as React from "react";
import { Button } from "@dashlane/ui-components";
import useTranslate from "../../../../../libs/i18n/useTranslate";
import { Invoice, PremiumLogTypes } from "@dashlane/communication";
import { TranslatorInterface } from "../../../../../libs/i18n/types";
import { DownloadInvoiceConfirmation } from "../download-invoice-confirmation/download-invoice-confirmation";
import styles from "./styles.css";
import { LocaleFormat } from "../../../../../libs/i18n/helpers";
import { fromUnixTime } from "date-fns";
const invoiceNumberPrefix = "INVPRE";
const I18N_KEYS = {
  ITEM_INVOICE_NUMBER: "webapp_account_invoices_item_invoice_number",
  ITEM_DATE: "webapp_account_invoices_item_date",
  ITEM_DOWNLOAD: "webapp_account_invoices_item_download",
  ITEM_PRICE_FREE: "webapp_account_invoices_item_free",
  ITEM_APP_STORE: "webapp_account_invoices_item_app_store_",
  ITEM_DESCRIPTION_PROMO_PREMIUM_DAYS:
    "webapp_account_invoices_item_promotional_premium_days",
  ITEM_DESCRIPTION_IN_APP_PURCHASE:
    "webapp_account_invoices_item_in_app_purchase",
  ITEM_DESCRIPTION_PROMO_PREMIUM:
    "webapp_account_invoices_item_promotional_premium",
  ITEM_DESCRIPTION_DISCOUNT_SUBS:
    "webapp_account_invoices_item_discounted_subscription",
  ITEM_DESCRIPTION_FULL_SUBS:
    "webapp_account_invoices_item_full_price_subscription",
  ITEM_DESCRIPTION_CROSSSELL: "webapp_account_invoices_item_crosssell",
  ITEM_DESCRIPTION_DISCOUNT_FAMILY_SUBS:
    "webapp_account_invoices_item_discounted_family_subscription",
  ITEM_DESCRIPTION_FULL_FAMILY_SUBS:
    "webapp_account_invoices_item_full_price_family_subscription",
  ITEM_DESCRIPTION_LEGACY: "webapp_account_invoices_item_legacy",
};
export interface Props {
  invoice: Invoice;
  onDownloadInvoiceRequested: (invoice: Invoice) => void;
  onCancelDownloadRequested: () => void;
  isDownloadInvoiceRequested: boolean;
  onCustomizeInvoiceRequested: () => void;
  onDownloadInvoiceConfirmed: () => void;
  index: number;
}
const isInAppPurchase = (invoice: Invoice) =>
  invoice.planType === "mac" ||
  invoice.planType === "ios" ||
  invoice.planType === "ios_renewable" ||
  invoice.planType === "playstore";
const getFormattedPriceForInvoice = (
  invoice: Invoice,
  translate: TranslatorInterface
) => {
  if (invoice.amountPaid) {
    const currency = invoice.currency || "usd";
    return translate.price(currency, invoice.amountPaid / 100);
  }
  return translate(I18N_KEYS.ITEM_PRICE_FREE);
};
const shouldDisplayDownloadButtonForInvoice = (invoice: Invoice) =>
  invoice.invoiceId &&
  invoice.eventType !== "set_as_legacy" &&
  !isInAppPurchase(invoice);
const getCopyForAppStore = (
  planType: string,
  translate: TranslatorInterface
) => {
  const storeKeyIdentifiers = ["ios", "playstore", "mac"];
  for (const currentStoreKey of storeKeyIdentifiers) {
    if (planType.toLowerCase().includes(currentStoreKey)) {
      return translate(I18N_KEYS.ITEM_APP_STORE + currentStoreKey);
    }
  }
  return null;
};
const getTierSuffix = (invoice: Invoice) => {
  if (invoice.planFeature === "premiumplus") {
    return "_plus";
  } else if (invoice.planFeature === "essentials") {
    return "_essentials";
  }
  return "";
};
const getDescriptionForInvoice = (
  invoice: Invoice,
  translate: TranslatorInterface
) => {
  const duration = invoice.duration
    ? parseInt(invoice.duration.split("-")[1], 10)
    : 0;
  const tierSuffix = getTierSuffix(invoice);
  const durationKeySuffix = invoice.duration.includes("M-")
    ? "_months"
    : "_years";
  if (isInAppPurchase(invoice)) {
    return translate(
      `${I18N_KEYS.ITEM_DESCRIPTION_IN_APP_PURCHASE}${durationKeySuffix}${tierSuffix}`,
      {
        count: duration,
        appStore: getCopyForAppStore(invoice.planType, translate),
      }
    );
  }
  if (invoice.eventType === PremiumLogTypes.premiumGranted) {
    if (invoice.duration.includes("d-")) {
      return translate(
        I18N_KEYS.ITEM_DESCRIPTION_PROMO_PREMIUM_DAYS + tierSuffix,
        {
          count: duration,
        }
      );
    }
    return translate(
      `${I18N_KEYS.ITEM_DESCRIPTION_PROMO_PREMIUM}${durationKeySuffix}${tierSuffix}`,
      {
        count: duration,
      }
    );
  }
  if (
    invoice.eventType === PremiumLogTypes.renewed ||
    invoice.eventType === PremiumLogTypes.subscribed
  ) {
    if (invoice.discountRatio) {
      return translate(
        `${I18N_KEYS.ITEM_DESCRIPTION_DISCOUNT_SUBS}${durationKeySuffix}${tierSuffix}`,
        {
          count: duration,
          discountPercentage: Math.floor(invoice.discountRatio * 100),
        }
      );
    }
    return translate(
      `${I18N_KEYS.ITEM_DESCRIPTION_FULL_SUBS}${durationKeySuffix}${tierSuffix}`,
      {
        count: duration,
      }
    );
  }
  if (invoice.eventType === PremiumLogTypes.crosssellPurchased) {
    return translate(
      `${I18N_KEYS.ITEM_DESCRIPTION_CROSSSELL}${durationKeySuffix}${tierSuffix}`,
      {
        count: duration,
      }
    );
  }
  if (
    invoice.eventType === PremiumLogTypes.familyCreated ||
    invoice.eventType === PremiumLogTypes.familyRenewed
  ) {
    if (invoice.discountRatio) {
      return translate(
        `${I18N_KEYS.ITEM_DESCRIPTION_DISCOUNT_FAMILY_SUBS}${durationKeySuffix}${tierSuffix}`,
        {
          count: duration,
          discountPercentage: Math.floor(invoice.discountRatio * 100),
        }
      );
    }
    return translate(
      `${I18N_KEYS.ITEM_DESCRIPTION_FULL_FAMILY_SUBS}${durationKeySuffix}${tierSuffix}`,
      {
        count: duration,
      }
    );
  }
  if (invoice.eventType === PremiumLogTypes.setAsLegacy) {
    return translate(I18N_KEYS.ITEM_DESCRIPTION_LEGACY);
  }
  return null;
};
export const InvoiceItem = ({
  invoice,
  onDownloadInvoiceRequested,
  onCancelDownloadRequested,
  isDownloadInvoiceRequested,
  onCustomizeInvoiceRequested,
  onDownloadInvoiceConfirmed,
  index,
}: Props) => {
  const { translate } = useTranslate();
  return (
    <li className={styles.item}>
      {index === 0 && <div className={styles.divider} />}
      <header className={styles.itemHeader}>
        <div className={styles.itemDescription}>
          {getDescriptionForInvoice(invoice, translate)}
        </div>
        <div className={styles.itemAmount}>
          {getFormattedPriceForInvoice(invoice, translate)}{" "}
        </div>
      </header>
      <div className={styles.itemDetails}>
        <div className={styles.itemInfo}>
          <div>
            <span className={styles.itemInfoLabel}>
              {translate(I18N_KEYS.ITEM_INVOICE_NUMBER)}
            </span>
            <span className={styles.itemInfoValue}>
              {invoice.invoiceId
                ? invoiceNumberPrefix + invoice.invoiceId
                : "-"}{" "}
            </span>
          </div>
          <div>
            <span className={styles.itemInfoLabel}>
              {translate(I18N_KEYS.ITEM_DATE)}
            </span>
            <span className={styles.itemInfoValue}>
              {translate.shortDate(
                fromUnixTime(invoice.startDate),
                LocaleFormat.ll
              )}
            </span>
          </div>
        </div>
        {shouldDisplayDownloadButtonForInvoice(invoice) && (
          <Button
            type="button"
            size="small"
            nature="secondary"
            onClick={() => onDownloadInvoiceRequested(invoice)}
          >
            {translate(I18N_KEYS.ITEM_DOWNLOAD)}
          </Button>
        )}
      </div>

      <DownloadInvoiceConfirmation
        onCancelDownloadRequested={onCancelDownloadRequested}
        isDownloadInvoiceRequested={isDownloadInvoiceRequested}
        onCustomizeInvoiceRequested={onCustomizeInvoiceRequested}
        onDownloadInvoiceConfirmed={onDownloadInvoiceConfirmed}
      />
    </li>
  );
};
