import * as React from 'react';
import { Invoice } from '@dashlane/communication';
import useTranslate from 'libs/i18n/useTranslate';
import { InvoiceItem } from '../invoice-item/invoice-item';
import invoiceImage from './assets/invoice.svg';
import styles from './styles.css';
const I18N_KEYS = {
    LIST_NO_RECEIPTS_IMAGE_ALT: 'webapp_account_invoices_empty_list_image_alt',
    LIST_NO_RECEIPTS_MESSAGE: 'webapp_account_invoices_empty_list_message',
};
interface InvoiceList {
    invoices: Invoice[] | null;
    onDownloadInvoiceRequested: (invoice: Invoice) => void;
    onCancelDownloadRequested: () => void;
    selectedInvoiceId: number | null;
    onCustomizeInvoiceRequested: () => void;
    onDownloadInvoiceConfirmed: () => void;
}
const eventTypeWhitelist = [
    'premium_granted',
    'renewed',
    'subscribed',
    'crosssell_purchased',
    'family_created',
    'family_renewed',
];
const filterInvoices = (invoices: Invoice[]) => invoices.filter((invoice) => eventTypeWhitelist.includes(invoice.eventType));
const sortInvoices = (invoices: Invoice[]) => invoices.sort((invoice1: Invoice, invoice2: Invoice) => {
    return invoice2.startDate - invoice1.startDate;
});
export const InvoiceList = ({ invoices, onDownloadInvoiceRequested, onCancelDownloadRequested, selectedInvoiceId, onCustomizeInvoiceRequested, onDownloadInvoiceConfirmed, }: InvoiceList) => {
    const { translate } = useTranslate();
    if (!invoices || !invoices.length) {
        return (<div>
        <img alt={translate(I18N_KEYS.LIST_NO_RECEIPTS_IMAGE_ALT)} src={invoiceImage} className={styles.noReceiptsImage}/>
        <p className={styles.emptyInvoiceListMessage}>
          {translate(I18N_KEYS.LIST_NO_RECEIPTS_MESSAGE)}
        </p>
      </div>);
    }
    const filteredInvoices = filterInvoices(invoices);
    return (<ol className={styles.invoiceList}>
      {sortInvoices(filteredInvoices).map((invoice: Invoice, ix: number) => (<InvoiceItem key={invoice.eventType + invoice.startDate} invoice={invoice} onDownloadInvoiceRequested={onDownloadInvoiceRequested} onCancelDownloadRequested={onCancelDownloadRequested} isDownloadInvoiceRequested={invoice.invoiceId ? selectedInvoiceId === invoice.invoiceId : false} onCustomizeInvoiceRequested={onCustomizeInvoiceRequested} onDownloadInvoiceConfirmed={onDownloadInvoiceConfirmed} index={ix}/>))}
    </ol>);
};
