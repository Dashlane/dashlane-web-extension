import { useEffect, useState } from "react";
import {
  DisplayField,
  DSStyleObject,
  LinkButton,
  useToast,
} from "@dashlane/design-system";
import { Permission } from "@dashlane/access-rights-contracts";
import useTranslate from "../../../../libs/i18n/useTranslate";
import { useGetTeamName } from "../../../hooks/use-get-team-name";
import { CompanyNameDialog } from "../company-name/company-name-dialog";
import { StyleProps } from "../company-information";
export const I18N_KEYS = {
  BUTTON: "account_summary_company_details_name_edit_button",
  EMPTY_FIELD_PLACEHOLDER:
    "account_summary_company_details_empty_field_placeholder",
  LABEL: "account_summary_company_details_name_label",
  SUCCESS_TOAST: "account_summary_company_details_name_success",
};
interface Props {
  hasPermission: (permissionArray: Permission) => boolean;
  style: Record<StyleProps, DSStyleObject>;
  teamId: number;
}
export const CompanyName = ({ hasPermission, style, teamId }: Props) => {
  const [name, setName] = useState("");
  const [dialogIsOpen, setDialogIsOpen] = useState(false);
  const [changeSuccess, setChangeSuccess] = useState(false);
  const queryData = useGetTeamName();
  const { translate } = useTranslate();
  const { showToast } = useToast();
  useEffect(() => {
    if (queryData) {
      setName(queryData);
    }
  }, [queryData]);
  useEffect(() => {
    if (changeSuccess) {
      showToast({
        mood: "brand",
        description: translate(I18N_KEYS.SUCCESS_TOAST),
      });
    }
  }, [changeSuccess, showToast, translate]);
  if (name === null || !teamId) {
    return null;
  }
  const onClickChangeTeamName = () => {
    setDialogIsOpen(true);
  };
  const isTeamCaptain = hasPermission("ALL");
  return (
    <>
      <div sx={style.DISPLAY_GROUP}>
        <DisplayField
          data-testid={"company-name-display"}
          label={translate(I18N_KEYS.LABEL)}
          value={name}
          placeholder={translate(I18N_KEYS.EMPTY_FIELD_PLACEHOLDER)}
        />
        {isTeamCaptain ? (
          <LinkButton
            onClick={onClickChangeTeamName}
            as="button"
            sx={style.LINK_BUTTON}
          >
            {translate(I18N_KEYS.BUTTON)}
          </LinkButton>
        ) : null}
      </div>
      <CompanyNameDialog
        isOpen={dialogIsOpen}
        setIsOpen={setDialogIsOpen}
        signalNameChangeSuccess={setChangeSuccess}
        teamName={name}
        setTeamName={setName}
        teamId={teamId}
      />
    </>
  );
};
