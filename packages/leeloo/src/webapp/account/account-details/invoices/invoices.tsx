import React, { useEffect, useState } from "react";
import { fromUnixTime } from "date-fns";
import { Invoice } from "@dashlane/communication";
import { AccountSubPanel } from "../../account-subpanel/account-subpanel";
import useTranslate from "../../../../libs/i18n/useTranslate";
import { downloadFile } from "../../../../libs/file-download/file-download";
import { LocaleFormat } from "../../../../libs/i18n/helpers";
import { carbonConnector } from "../../../../libs/carbon/connector";
import { InvoiceList } from "./invoice-list/invoice-list";
import {
  InvoiceCustomData,
  InvoiceCustomize,
} from "./invoice-customize/invoice-customize";
const I18N_KEYS = {
  CUSTOMIZE_PANEL_HEADING: "webapp_account_invoices_customize_panel_heading",
  PANEL_HEADING: "webapp_account_invoices_panel_heading",
};
interface InvoicesProps {
  onNavigateOut: () => void;
}
export const Invoices = ({ onNavigateOut }: InvoicesProps) => {
  const { translate } = useTranslate();
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [customizeInvoiceMode, setCustomizeInvoiceMode] = useState(false);
  const [invoices, setInvoices] = useState<Invoice[] | null>(null);
  const reset = () => {
    setSelectedInvoice(null);
    setCustomizeInvoiceMode(false);
  };
  useEffect(() => {
    const getInvoices = async () => {
      const result = await carbonConnector.getInvoices(null);
      if (result && result.invoices) {
        setInvoices(result.invoices);
      }
    };
    getInvoices();
    return () => {
      reset();
    };
  }, []);
  const invoiceSelected = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
  };
  const deselectInvoice = () => {
    setSelectedInvoice(null);
  };
  const customizeInvoiceRequested = () => {
    setCustomizeInvoiceMode(true);
  };
  const downloadInvoice = async (invoiceCustomData?: InvoiceCustomData) => {
    if (selectedInvoice) {
      const filename = `dashlane_invoice_${translate.shortDate(
        fromUnixTime(selectedInvoice?.startDate),
        LocaleFormat.L
      )}`;
      const response = await carbonConnector.downloadCustomerInvoice({
        invoiceId: selectedInvoice.invoiceId,
        lang: "en",
        ...invoiceCustomData,
      });
      if (response.success) {
        const { data } = JSON.parse(response.data);
        const arrayBuffer = new Uint8Array(data).buffer;
        downloadFile(arrayBuffer, filename, "application/pdf");
      }
      reset();
    }
  };
  const hideCustomizeInvoicePanel = () => {
    setCustomizeInvoiceMode(false);
  };
  if (customizeInvoiceMode) {
    return (
      <AccountSubPanel
        headingText={translate(I18N_KEYS.CUSTOMIZE_PANEL_HEADING)}
        onNavigateOut={hideCustomizeInvoicePanel}
      >
        <InvoiceCustomize
          onDownloadInvoice={(invoiceCustomData: InvoiceCustomData) =>
            downloadInvoice(invoiceCustomData)
          }
          onCancel={hideCustomizeInvoicePanel}
        />
      </AccountSubPanel>
    );
  } else {
    return (
      <AccountSubPanel
        headingText={translate(I18N_KEYS.PANEL_HEADING)}
        onNavigateOut={onNavigateOut}
      >
        <InvoiceList
          invoices={invoices}
          onDownloadInvoiceRequested={invoiceSelected}
          onCancelDownloadRequested={deselectInvoice}
          selectedInvoiceId={selectedInvoice ? selectedInvoice.invoiceId : null}
          onCustomizeInvoiceRequested={customizeInvoiceRequested}
          onDownloadInvoiceConfirmed={() => downloadInvoice()}
        />
      </AccountSubPanel>
    );
  }
};
