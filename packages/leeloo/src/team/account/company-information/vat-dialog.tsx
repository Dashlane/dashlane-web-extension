import { ChangeEvent, useEffect, useState } from "react";
import { Dialog, Paragraph, TextField } from "@dashlane/design-system";
import { isFailure, Result } from "@dashlane/framework-types";
import {
  DeleteTeamVatError,
  UpsertTeamVatError,
} from "@dashlane/team-admin-contracts";
import useTranslate from "../../../libs/i18n/useTranslate";
import { validateEUVATNumber } from "../../components/vat-number/validate-vat-number";
interface Props {
  isOpen: boolean;
  setIsOpen: (dialogShown: boolean) => void;
  VATNumber: string;
  setVATNumber: (newVATNumber: string) => void;
  signalVATChangeSuccess: (success: boolean) => void;
  upsertVATNumber: (
    newVATNumber: Record<"newVATNumber", string>
  ) => Promise<Result<undefined, UpsertTeamVatError>>;
  deleteVATNumber: () => Promise<Result<undefined, DeleteTeamVatError>>;
}
export const I18N_KEYS = {
  SAVE_BUTTON: "account_summary_company_details_vat_dialog_save_button",
  CANCEL_BUTTON: "account_summary_company_details_vat_dialog_cancel_button",
  CLEAR_BUTTON: "account_summary_company_details_vat_dialog_clear_label",
  CLOSE_LABEL: "account_summary_company_details_vat_dialog_close_label",
  TITLE: "account_summary_company_details_vat_dialog_title",
  DESCRIPTION: "account_summary_company_details_vat_dialog_desc",
  FIELD_LABEL: "account_summary_company_details_vat_dialog_field_label",
  FIELD_PLACEHOLDER:
    "account_summary_company_details_vat_dialog_field_placeholder",
  INVALID_VAT_ERROR: "team_account_vat_number_invalid",
  GENERIC_ERROR: "team_account_vat_number_error_something_wrong",
};
export const VATDialog = ({
  isOpen,
  setIsOpen,
  setVATNumber,
  signalVATChangeSuccess,
  VATNumber,
  upsertVATNumber,
  deleteVATNumber,
}: Props) => {
  const [fieldValue, setFieldValue] = useState<string>();
  const [fieldError, setFieldError] = useState<string>();
  const { translate } = useTranslate();
  useEffect(() => {
    if (VATNumber) {
      setFieldValue(VATNumber);
    }
  }, [VATNumber]);
  const handleClose = () => {
    setIsOpen(false);
    setFieldValue(VATNumber);
    setFieldError(undefined);
  };
  const handleEdit = (event: ChangeEvent) => {
    setFieldError(undefined);
    setFieldValue((event.target as HTMLInputElement).value);
  };
  const handleSubmit = async (newVATNumber: string) => {
    const genericErrorMessage = translate(I18N_KEYS.GENERIC_ERROR);
    let result;
    if (!newVATNumber) {
      if (VATNumber) {
        result = await deleteVATNumber();
      } else {
        setFieldError(genericErrorMessage);
        throw new Error(genericErrorMessage);
      }
    } else {
      if (!validateEUVATNumber(newVATNumber)) {
        const errorMessage = translate(I18N_KEYS.INVALID_VAT_ERROR);
        setFieldError(errorMessage);
        throw new Error(errorMessage);
      }
      result = await upsertVATNumber({ newVATNumber });
    }
    if (isFailure<undefined, UpsertTeamVatError | DeleteTeamVatError>(result)) {
      signalVATChangeSuccess(false);
      const errorMessage = translate(I18N_KEYS.GENERIC_ERROR);
      setFieldError(errorMessage);
      throw new Error(errorMessage);
    }
    setIsOpen(false);
    signalVATChangeSuccess(true);
    setVATNumber(newVATNumber);
  };
  return (
    <Dialog
      isOpen={isOpen}
      actions={{
        primary: {
          children: translate(I18N_KEYS.SAVE_BUTTON),
          onClick: () => handleSubmit(fieldValue ?? ""),
        },
        secondary: {
          children: translate(I18N_KEYS.CANCEL_BUTTON),
          onClick: handleClose,
        },
      }}
      title={translate(I18N_KEYS.TITLE)}
      closeActionLabel={translate(I18N_KEYS.CLOSE_LABEL)}
      onClose={handleClose}
    >
      <Paragraph>{translate(I18N_KEYS.DESCRIPTION)}</Paragraph>
      <TextField
        data-testid={"enter-vat-number"}
        label={translate(I18N_KEYS.FIELD_LABEL)}
        value={fieldValue}
        onChange={handleEdit}
        sx={{ marginTop: "16px" }}
        placeholder={translate(I18N_KEYS.FIELD_PLACEHOLDER)}
        error={!!fieldError}
        feedback={fieldError}
        hasClearAction
        clearActionLabel={translate(I18N_KEYS.CLEAR_BUTTON)}
      />
    </Dialog>
  );
};
