import { useState } from "react";
import { Dialog, TextField } from "@dashlane/design-system";
import useTranslate from "../../../libs/i18n/useTranslate";
const I18N_KEYS = {
  CLOSE: "_common_dialog_dismiss_button",
  INPUT_LABELS: {
    ADDRESS: "manage_subscription_billing_details_dialog_address_label",
    COMPANY: "manage_subscription_billing_details_dialog_company_label",
    NAME: "manage_subscription_billing_details_dialog_name_label",
    TAX_ID: "manage_subscription_billing_details_dialog_tax_id_label",
  },
  PLACEHOLDERS: {
    ADDRESS: "manage_subscription_billing_details_dialog_address_placeholder",
    COMPANY: "manage_subscription_billing_details_dialog_company_placeholder",
    NAME: "manage_subscription_billing_details_dialog_name_placeholder",
    TAX_ID: "manage_subscription_billing_details_dialog_tax_id_placeholder",
  },
  SAVE_BUTTON: "manage_subscription_billing_details_dialog_download_button",
  TITLE: "manage_subscription_billing_details_dialog_title",
};
export interface InvoiceCustomData {
  recipient?: string;
  company?: string;
  address?: string;
  vatNumber?: string;
}
interface EditInvoiceDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onDownloadInvoice: (invoiceCustomData: InvoiceCustomData) => void;
}
export const EditInvoiceDialog = ({
  isOpen,
  onClose,
  onDownloadInvoice,
}: EditInvoiceDialogProps) => {
  const { translate } = useTranslate();
  const [name, setName] = useState<string>("");
  const [company, setCompany] = useState<string>("");
  const [address, setAddress] = useState<string>("");
  const [taxId, setTaxId] = useState<string>("");
  const updateInvoice = () => {
    const invoiceCustomData: InvoiceCustomData = {};
    if (name !== "") {
      invoiceCustomData.recipient = name;
    }
    if (company !== "") {
      invoiceCustomData.company = company;
    }
    if (address !== "") {
      invoiceCustomData.address = address;
    }
    if (taxId !== "") {
      invoiceCustomData.vatNumber = taxId;
    }
    onDownloadInvoice(invoiceCustomData);
  };
  return (
    <Dialog
      title={translate(I18N_KEYS.TITLE)}
      closeActionLabel={translate(I18N_KEYS.CLOSE)}
      isOpen={isOpen}
      onClose={onClose}
      actions={{
        primary: {
          onClick: updateInvoice,
          children: translate(I18N_KEYS.SAVE_BUTTON),
        },
      }}
    >
      <div
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: "16px",
          margin: "20px 0",
        }}
      >
        <TextField
          autoFocus
          data-testid="invoiceNameInput"
          label={translate(I18N_KEYS.INPUT_LABELS.NAME)}
          onChange={(event) => setName(event.target.value)}
          placeholder={translate(I18N_KEYS.PLACEHOLDERS.NAME)}
        />
        <TextField
          data-testid="invoiceCompanyInput"
          label={translate(I18N_KEYS.INPUT_LABELS.COMPANY)}
          onChange={(event) => setCompany(event.target.value)}
          placeholder={translate(I18N_KEYS.PLACEHOLDERS.COMPANY)}
        />
        <TextField
          label={translate(I18N_KEYS.INPUT_LABELS.ADDRESS)}
          onChange={(event) => setAddress(event.target.value)}
          placeholder={translate(I18N_KEYS.PLACEHOLDERS.ADDRESS)}
        />
        <TextField
          label={translate(I18N_KEYS.INPUT_LABELS.TAX_ID)}
          onChange={(event) => setTaxId(event.target.value)}
          placeholder={translate(I18N_KEYS.PLACEHOLDERS.TAX_ID)}
        />
      </div>
    </Dialog>
  );
};
