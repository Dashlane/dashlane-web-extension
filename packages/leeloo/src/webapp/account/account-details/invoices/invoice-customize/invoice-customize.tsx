import React, { useState } from 'react';
import { Button, TextInput } from '@dashlane/ui-components';
import useTranslate from 'libs/i18n/useTranslate';
import styles from './styles.css';
const I18N_KEYS = {
    CUSTOMIZE_RECIPIENT: 'webapp_account_invoices_customize_recipient',
    CUSTOMIZE_RECIPIENT_OPTIONAL: 'webapp_account_invoices_customize_recipient_optional',
    CUSTOMIZE_COMPANY: 'webapp_account_invoices_customize_company',
    CUSTOMIZE_COMPANY_OPTIONAL: 'webapp_account_invoices_customize_company_optional',
    CUSTOMIZE_ADDRESS: 'webapp_account_invoices_customize_address',
    CUSTOMIZE_ADDRESS_OPTIONAL: 'webapp_account_invoices_customize_address_optional',
    CUSTOMIZE_TAX_NUMBER: 'webapp_account_invoices_customize_tax_number',
    CUSTOMIZE_TAX_NUMBER_OPTIONAL: 'webapp_account_invoices_customize_tax_number_optional',
    CUSTOMIZE_BUTTON_CONFIRM: 'webapp_account_invoices_customize_customize_button',
    CUSTOMIZE_BUTTON_CANCEL: 'webapp_account_invoices_customize_cancel_button',
};
export interface InvoiceCustomData {
    recipient?: string;
    company?: string;
    address?: string;
    vatNumber?: string;
}
interface InvoiceCustomizeProps {
    onDownloadInvoice: (invoiceCustomData: InvoiceCustomData) => void;
    onCancel: () => void;
}
export const InvoiceCustomize = ({ onDownloadInvoice, onCancel, }: InvoiceCustomizeProps) => {
    const { translate } = useTranslate();
    const [recipient, setRecipient] = useState('');
    const [company, setCompany] = useState('');
    const [address, setAddress] = useState('');
    const [vatNumber, setVatNumber] = useState('');
    const onSubmit = () => {
        const invoiceCustomData: InvoiceCustomData = {};
        if (recipient !== '') {
            invoiceCustomData.recipient = recipient;
        }
        if (company !== '') {
            invoiceCustomData.company = company;
        }
        if (address !== '') {
            invoiceCustomData.address = address;
        }
        if (vatNumber !== '') {
            invoiceCustomData.vatNumber = vatNumber;
        }
        onDownloadInvoice(invoiceCustomData);
    };
    return (<div className={styles.form}>
      <div className={styles.divider}/>
      <TextInput label={<label htmlFor="customize-invoice-recipient">
            {translate(I18N_KEYS.CUSTOMIZE_RECIPIENT)}
          </label>} autoFocus fullWidth id="customize-invoice-recipient" placeholder={translate(I18N_KEYS.CUSTOMIZE_RECIPIENT_OPTIONAL)} onChange={(evt) => setRecipient(evt.target.value)}/>

      <TextInput label={<label htmlFor="customize-invoice-company">
            {translate(I18N_KEYS.CUSTOMIZE_COMPANY)}
          </label>} fullWidth id="customize-invoice-company" placeholder={translate(I18N_KEYS.CUSTOMIZE_COMPANY_OPTIONAL)} onChange={(evt) => setCompany(evt.target.value)}/>

      <TextInput label={<label htmlFor="customize-invoice-address">
            {translate(I18N_KEYS.CUSTOMIZE_ADDRESS)}
          </label>} id="customize-invoice-address" multiline fullWidth onChange={(evt) => setAddress(evt.target.value)} placeholder={translate(I18N_KEYS.CUSTOMIZE_ADDRESS_OPTIONAL)}/>

      <TextInput label={<label htmlFor="customize-invoice-tax-number">
            {translate(I18N_KEYS.CUSTOMIZE_TAX_NUMBER)}
          </label>} fullWidth id="customize-invoice-tax-number" placeholder={translate(I18N_KEYS.CUSTOMIZE_TAX_NUMBER_OPTIONAL)} onChange={(evt) => setVatNumber(evt.target.value)}/>

      <div className={styles.buttonPanel}>
        <Button type="button" nature="primary" size="small" className={styles.customizeButton} onClick={onSubmit}>
          {translate(I18N_KEYS.CUSTOMIZE_BUTTON_CONFIRM)}
        </Button>
        <Button type="button" nature="secondary" size="small" className={styles.button} onClick={onCancel}>
          {translate(I18N_KEYS.CUSTOMIZE_BUTTON_CANCEL)}
        </Button>
      </div>
    </div>);
};
