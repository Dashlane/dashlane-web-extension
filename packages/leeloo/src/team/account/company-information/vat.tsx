import { useEffect, useState } from "react";
import {
  DisplayField,
  DSStyleObject,
  LinkButton,
  useToast,
} from "@dashlane/design-system";
import useTranslate from "../../../libs/i18n/useTranslate";
import { useTeamVat } from "../../hooks/use-team-vat";
import { VATDialog } from "./vat-dialog";
import { StyleProps } from "./company-information";
export const I18N_KEYS = {
  ADD_BTN: "account_summary_company_details_vat_number_add_button",
  LABEL: "account_summary_company_details_vat_number_label",
  SUCCESS_TOAST: "account_summary_company_details_vat_success",
  EDIT_BTN: "account_summary_company_details_vat_number_edit_button",
  EMPTY_FIELD_PLACEHOLDER:
    "account_summary_company_details_empty_field_placeholder",
};
interface Props {
  style: Record<StyleProps, DSStyleObject>;
}
export const VATNumber = ({ style }: Props) => {
  const [_VATNumber, setVATNumber] = useState("");
  const [dialogIsOpen, setDialogIsOpen] = useState(false);
  const [changeSuccess, setChangeSuccess] = useState(false);
  const { translate } = useTranslate();
  const { showToast } = useToast();
  const queryData = useTeamVat();
  const {
    isLoading,
    isErrored,
    teamVAT,
    upsertTeamVAT,
    isNotApplicable,
    deleteTeamVAT,
  } = queryData;
  useEffect(() => {
    if (!isLoading && !isErrored) {
      setVATNumber(teamVAT);
    }
  }, [isErrored, isLoading, teamVAT]);
  useEffect(() => {
    if (changeSuccess) {
      showToast({
        mood: "brand",
        description: translate(I18N_KEYS.SUCCESS_TOAST),
      });
    }
  }, [changeSuccess, showToast, translate]);
  if (
    isLoading ||
    isErrored ||
    !upsertTeamVAT ||
    !deleteTeamVAT ||
    isNotApplicable
  ) {
    return null;
  }
  const onClickChangeVATNumber = () => {
    setDialogIsOpen(true);
  };
  return (
    <>
      <div sx={style.DISPLAY_GROUP}>
        <DisplayField
          data-testid={"vat-number"}
          label={translate(I18N_KEYS.LABEL)}
          value={_VATNumber}
          placeholder={translate(I18N_KEYS.EMPTY_FIELD_PLACEHOLDER)}
        />
        <LinkButton
          onClick={onClickChangeVATNumber}
          as="button"
          sx={style.LINK_BUTTON}
        >
          {_VATNumber
            ? translate(I18N_KEYS.EDIT_BTN)
            : translate(I18N_KEYS.ADD_BTN)}
        </LinkButton>
      </div>
      <VATDialog
        isOpen={dialogIsOpen}
        setIsOpen={setDialogIsOpen}
        signalVATChangeSuccess={setChangeSuccess}
        VATNumber={_VATNumber}
        setVATNumber={setVATNumber}
        upsertVATNumber={upsertTeamVAT}
        deleteVATNumber={deleteTeamVAT}
      />
    </>
  );
};
