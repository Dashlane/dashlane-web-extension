import { ChangeEvent, useEffect, useState } from "react";
import { Dialog, Paragraph, TextField } from "@dashlane/design-system";
import { useModuleCommands } from "@dashlane/framework-react";
import { isFailure } from "@dashlane/framework-types";
import {
  EditTeamNameErrors,
  teamPlanDetailsApi,
} from "@dashlane/team-admin-contracts";
import useTranslate from "../../../../libs/i18n/useTranslate";
import { ErrorType, getErrorMessage } from "./company-name-errors";
export const I18N_KEYS = {
  SAVE_BUTTON: "account_summary_company_details_name_dialog_save_button",
  CANCEL_BUTTON: "account_summary_company_details_name_dialog_cancel_button",
  CLOSE_LABEL: "account_summary_company_details_name_dialog_close_label",
  TITLE: "account_summary_company_details_name_dialog_title",
  DESCRIPTION: "account_summary_company_details_name_dialog_desc",
  FIELD_LABEL: "account_summary_company_details_name_dialog_field_label",
  FIELD_PLACEHOLDER:
    "account_summary_company_details_name_dialog_field_placeholder",
};
interface Props {
  isOpen: boolean;
  setIsOpen: (dialogShown: boolean) => void;
  setTeamName: (newTeamName: string) => void;
  signalNameChangeSuccess: (success: boolean) => void;
  teamId: number;
  teamName: string;
}
export const CompanyNameDialog = ({
  isOpen,
  setIsOpen,
  setTeamName,
  signalNameChangeSuccess,
  teamName,
  teamId,
}: Props) => {
  const [fieldValue, setFieldValue] = useState(teamName);
  const [fieldError, setFieldError] = useState<string>();
  const { editTeamName } = useModuleCommands(teamPlanDetailsApi);
  const { translate } = useTranslate();
  useEffect(() => {
    setFieldValue(teamName);
  }, [teamName]);
  const handleClose = () => {
    setIsOpen(false);
    setFieldValue(teamName);
    setFieldError(undefined);
  };
  const handleEdit = (event: ChangeEvent) => {
    setFieldError(undefined);
    setFieldValue((event.target as HTMLInputElement).value);
  };
  const handleSubmit = async (newTeamName: string) => {
    if (!newTeamName) {
      const errorMessage = getErrorMessage(translate, ErrorType.EMPTY);
      setFieldError(errorMessage);
      throw new Error(errorMessage);
    }
    const result = await editTeamName({
      teamId,
      newTeamName,
    });
    if (isFailure(result)) {
      signalNameChangeSuccess(false);
      if (result.error.tag === EditTeamNameErrors.DUPLICATE) {
        const errorMessage = getErrorMessage(translate, ErrorType.DUPLICATE);
        setFieldError(errorMessage);
        throw new Error(errorMessage);
      } else if (
        result.error.tag === EditTeamNameErrors.INVALID_TEAM_SETTING_VALUE
      ) {
        const errorMessage = getErrorMessage(translate, ErrorType.MALFORMED);
        setFieldError(errorMessage);
        throw new Error(errorMessage);
      } else {
        const errorMessage = getErrorMessage(
          translate,
          ErrorType.SOMETHING_WRONG
        );
        setFieldError(errorMessage);
        throw new Error(errorMessage);
      }
    }
    setIsOpen(false);
    signalNameChangeSuccess(true);
    setTeamName(newTeamName);
  };
  return (
    <Dialog
      isOpen={isOpen}
      actions={{
        primary: {
          children: translate(I18N_KEYS.SAVE_BUTTON),
          onClick: () => handleSubmit(fieldValue),
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
        data-testid={"company-name"}
        label={translate(I18N_KEYS.FIELD_LABEL)}
        value={fieldValue}
        onChange={handleEdit}
        sx={{ marginTop: "16px" }}
        placeholder={translate(I18N_KEYS.FIELD_PLACEHOLDER)}
        error={!!fieldError}
        feedback={fieldError}
      />
    </Dialog>
  );
};
