import { useEffect, useState } from "react";
import {
  Button,
  Card,
  Heading,
  IndeterminateLoader,
  LinkButton,
  Paragraph,
} from "@dashlane/design-system";
import { DataStatus } from "@dashlane/carbon-api-consumers";
import { carbonConnector } from "../../../libs/carbon/connector";
import { isPaidAccount } from "../../../libs/account/helpers";
import { openDashlaneUrl } from "../../../libs/external-urls";
import { usePremiumStatus } from "../../../libs/carbon/hooks/usePremiumStatus";
import { useInvoicesCount } from "../../../libs/carbon/hooks/useInvoiceList";
import useTranslate from "../../../libs/i18n/useTranslate";
import {
  APP_STORE_BILL_HISTORY,
  GOOGLE_PLAY_BILL_HISTORY,
} from "../../../team/urls";
import { CancellationStep } from "../types";
const I18N_KEYS = {
  BUTTON_LEARN_MORE: "manage_subscription_learn_more_button",
  CARD_TITLE: "manage_subscription_billing_section_title",
  APPLE_BILL: "manage_subscription_billing_section_desc_past_bills_apple",
  APPLE_NO_BILL: "manage_subscription_billing_section_desc_no_bills_apple",
  GOOGLE_BILL: "manage_subscription_billing_section_desc_past_bills_google",
  GOOGLE_NO_BILL: "manage_subscription_billing_section_desc_no_bills_google",
  MANAGE_NO_BILLS: "manage_subscription_billing_section_desc_no_bills",
  MANAGE_BILLS: "manage_subscription_billing_section_desc_with_bills",
  VIEW_RECEIPTS_BUTTON:
    "manage_subscription_billing_section_view_receipts_button",
};
export interface BillingHistoryCardProps {
  setCancellationStep: (step: CancellationStep) => void;
}
export const BillingHistoryCard = ({
  setCancellationStep,
}: BillingHistoryCardProps) => {
  const premiumStatus = usePremiumStatus();
  const { translate } = useTranslate();
  const [hasListLoaded, setHasListLoaded] = useState<boolean>(false);
  const invoiceCount = useInvoicesCount(hasListLoaded);
  useEffect(() => {
    carbonConnector.fetchInvoiceList().then(() => setHasListLoaded(true));
  }, []);
  if (premiumStatus.status !== DataStatus.Success || !premiumStatus.data) {
    return <IndeterminateLoader />;
  }
  const { planType } = premiumStatus.data;
  const isPaidAccountUser = isPaidAccount(premiumStatus.data);
  const isAppStoreUser = planType?.includes("ios") ?? false;
  const isGooglePlayUser = planType?.includes("playstore") ?? false;
  const hasInvoices = invoiceCount > 0;
  const getDescriptionText = (
    isAppStoreUser: boolean,
    isGooglePlayUser: boolean,
    hasInvoices: boolean
  ) => {
    if (isAppStoreUser) {
      return hasInvoices ? I18N_KEYS.APPLE_BILL : I18N_KEYS.APPLE_NO_BILL;
    }
    if (isGooglePlayUser) {
      return hasInvoices ? I18N_KEYS.GOOGLE_BILL : I18N_KEYS.GOOGLE_NO_BILL;
    }
    return hasInvoices ? I18N_KEYS.MANAGE_BILLS : I18N_KEYS.MANAGE_NO_BILLS;
  };
  const descriptionText = getDescriptionText(
    isAppStoreUser,
    isGooglePlayUser,
    hasInvoices
  );
  const goGetOutsideSupport = () => {
    openDashlaneUrl(
      isAppStoreUser ? APP_STORE_BILL_HISTORY : GOOGLE_PLAY_BILL_HISTORY,
      {
        type: "billingSupport",
        action: "goToExternalSupport",
      }
    );
  };
  const goToReceipts = () => {
    setCancellationStep(CancellationStep.INVOICE_LIST);
  };
  return (
    <Card gap="8px" padding="32px" sx={{ maxWidth: "70vw" }}>
      <div sx={{ display: "flex", justifyContent: "space-between" }}>
        <Heading as="h2">{translate(I18N_KEYS.CARD_TITLE)}</Heading>
        {hasInvoices ? (
          <Button onClick={goToReceipts} intensity="supershy">
            {translate(I18N_KEYS.VIEW_RECEIPTS_BUTTON)}
          </Button>
        ) : null}
      </div>
      <Paragraph color="ds.text.neutral.quiet">
        {translate(descriptionText)}
      </Paragraph>
      {isPaidAccountUser && (isAppStoreUser || isGooglePlayUser) ? (
        <LinkButton onClick={goGetOutsideSupport} isExternal>
          {translate(I18N_KEYS.BUTTON_LEARN_MORE)}
        </LinkButton>
      ) : null}
    </Card>
  );
};
