import qs from "query-string";
import { useRef, useState } from "react";
import { GridContainer } from "@dashlane/ui-components";
import { Dialog, Paragraph, TextField } from "@dashlane/design-system";
import { Lee, LEE_INCORRECT_AUTHENTICATION } from "../../../../lee";
import { getAuth } from "../../../../user";
import { Auth } from "../../../../user/types";
import { openUrl } from "../../../../libs/external-urls";
import useTranslate from "../../../../libs/i18n/useTranslate";
import { useAlertQueue } from "../../../alerts/use-alert-queue";
import { useGetTeamName } from "../../../hooks/use-get-team-name";
const I18N_KEYS = {
  RECIPIENT_IS_REQUIRED:
    "team_account_past_receipts_dialog_recipient_is_required",
  TITLE: "team_account_past_receipts_dialog_title",
  SUBTITLE: "team_account_past_receipts_dialog_instructions",
  BUTTON_DOWNLOAD: "team_account_past_receipts_dialog_download_button",
  BUTTON_CLOSE_DIALOG: "_common_dialog_dismiss_button",
  RECIPIENT: "team_account_past_receipts_dialog_recipient",
  RECIPIENT_HINT: "team_account_past_receipts_dialog_recipient_hint",
  COMPANY: "team_account_past_receipts_dialog_company",
  COMPANY_HINT: "team_account_past_receipts_dialog_company_hint",
  BILLING_ADDRESS: "team_account_past_receipts_dialog_billing_address",
  BILLING_ADDRESS_HINT:
    "team_account_past_receipts_dialog_billing_address_hint",
  VAT: "team_account_past_receipts_dialog_vat",
  VAT_HINT: "team_account_past_receipts_dialog_vat_hint",
};
interface Props {
  isOpen: boolean;
  lee: Lee;
  onClose: () => void;
}
export const PastReceiptsDialog = ({ isOpen, lee, onClose }: Props) => {
  const recipient = useRef<HTMLInputElement>(null);
  const company = useRef<HTMLInputElement>(null);
  const billingAddress = useRef<HTMLInputElement>(null);
  const vat = useRef<HTMLInputElement>(null);
  const { translate } = useTranslate();
  const { reportTACError } = useAlertQueue();
  const [showRecipientErrorText, setShowRecipientErrorText] = useState(false);
  const [buttonDisabled, setButtonDisabled] = useState(true);
  const teamName = useGetTeamName();
  if (!teamName) {
    return null;
  }
  const closeDialog = () => {
    setShowRecipientErrorText(false);
    onClose();
  };
  const getPdfGenerationOptionsAsSearchParams = (auth: Auth) => {
    const formData = {
      ...auth,
      recipient: recipient.current?.value,
      company: company.current?.value,
      address: billingAddress.current?.value,
      vatNumber: vat.current?.value,
    };
    return qs.stringify(formData);
  };
  const onGenerateReceipts = () => {
    const auth = getAuth(lee.globalState);
    if (!auth) {
      reportTACError(new Error(LEE_INCORRECT_AUTHENTICATION));
      return;
    }
    if (recipient.current?.value) {
      closeDialog();
      try {
        openUrl("__REDACTED__" + getPdfGenerationOptionsAsSearchParams(auth));
      } catch (error) {
        reportTACError(error);
      }
    } else {
      setShowRecipientErrorText(true);
    }
  };
  const onRecipientFieldChange = () => {
    if (!recipient.current?.value) {
      setButtonDisabled(true);
      setShowRecipientErrorText(true);
    } else {
      setButtonDisabled(false);
      setShowRecipientErrorText(false);
    }
  };
  const inputFeedbackProps = showRecipientErrorText
    ? {
        feedback: { text: translate(I18N_KEYS.RECIPIENT_IS_REQUIRED) },
        error: true,
      }
    : {};
  return (
    <Dialog
      title={translate(I18N_KEYS.TITLE)}
      closeActionLabel={translate(I18N_KEYS.BUTTON_CLOSE_DIALOG)}
      isOpen={isOpen}
      onClose={closeDialog}
      actions={{
        primary: {
          children: translate(I18N_KEYS.BUTTON_DOWNLOAD),
          onClick: onGenerateReceipts,
          disabled: buttonDisabled,
        },
      }}
    >
      <Paragraph>{translate(I18N_KEYS.SUBTITLE)}</Paragraph>
      <GridContainer as="form" onSubmit={onGenerateReceipts} gap="1em">
        <TextField
          label={translate(I18N_KEYS.RECIPIENT) + " *"}
          placeholder={translate(I18N_KEYS.RECIPIENT_HINT)}
          onChange={onRecipientFieldChange}
          ref={recipient}
          {...inputFeedbackProps}
        />

        <TextField
          label={translate(I18N_KEYS.COMPANY)}
          value={teamName}
          placeholder={translate(I18N_KEYS.COMPANY_HINT)}
          ref={company}
        />

        <TextField
          label={translate(I18N_KEYS.BILLING_ADDRESS)}
          placeholder={translate(I18N_KEYS.BILLING_ADDRESS_HINT)}
          ref={billingAddress}
        />

        <TextField
          label={translate(I18N_KEYS.VAT)}
          placeholder={translate(I18N_KEYS.VAT_HINT)}
          ref={vat}
        />
      </GridContainer>
    </Dialog>
  );
};
