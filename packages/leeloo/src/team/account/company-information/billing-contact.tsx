import { useEffect, useState } from "react";
import { DisplayField, LinkButton, useToast } from "@dashlane/design-system";
import { DSStyleObject } from "@dashlane/design-system/jsx-runtime";
import { useModuleCommands } from "@dashlane/framework-react";
import { isFailure } from "@dashlane/framework-types";
import { Permission } from "@dashlane/access-rights-contracts";
import { teamPlanDetailsApi } from "@dashlane/team-admin-contracts";
import useTranslate from "../../../libs/i18n/useTranslate";
import { useTeamMembersNG } from "../../hooks/use-team-members";
import { ChangeBillingAdminDialog } from "./change-billing-admin-dialog/change-billing-admin-dialog";
import { StyleProps } from "./company-information";
export const I18N_KEYS = {
  LABEL: "account_summary_company_details_billing_contact_label",
  BUTTON: "account_summary_company_details_billing_contact_edit_button",
  ERROR_TOAST: "team_account_billing_admin_notification_something_wrong",
  EMPTY_FIELD_PLACEHOLDER:
    "account_summary_company_details_empty_field_placeholder",
};
interface Props {
  hasPermission: (permission: Permission) => boolean;
  style: Record<StyleProps, DSStyleObject>;
  teamId: number;
}
export const BillingContact = ({ style, teamId, hasPermission }: Props) => {
  const [billingContact, setBillingContact] = useState("");
  const [dialogIsOpen, setDialogIsOpen] = useState(false);
  const teamMembers = useTeamMembersNG(teamId);
  const { translate } = useTranslate();
  const { showToast } = useToast();
  const { updateBillingAdmin } = useModuleCommands(teamPlanDetailsApi);
  useEffect(() => {
    if (teamMembers && !billingContact) {
      setBillingContact(teamMembers.data?.billingAdmins[0] ?? "");
    }
  }, [billingContact, teamMembers]);
  const { isLoading, isErrored } = teamMembers;
  if (isLoading || isErrored) {
    return null;
  }
  const onClickChangeBillingContact = () => {
    setDialogIsOpen(true);
  };
  const onClickCloseBillingContactDialog = () => {
    setDialogIsOpen(false);
  };
  const handleSubmitNewBillingContact = async (newBillingContact: string) => {
    if (billingContact === newBillingContact) {
      return;
    }
    setDialogIsOpen(false);
    const result = await updateBillingAdmin({
      newAdminEmail: newBillingContact,
    });
    if (isFailure(result)) {
      showToast({
        mood: "danger",
        description: translate(I18N_KEYS.ERROR_TOAST),
      });
    } else {
      showToast({
        mood: "brand",
        description: translate(
          "team_account_billing_admin_notification_success"
        ),
      });
      setBillingContact(newBillingContact);
    }
  };
  const isFullAdmin = hasPermission("ALL");
  return (
    <>
      <div sx={style.DISPLAY_GROUP}>
        <DisplayField
          data-testid="billing-contact"
          className="automation-tests-tac-billing"
          label={translate(I18N_KEYS.LABEL)}
          value={billingContact ?? ""}
          placeholder={translate(I18N_KEYS.EMPTY_FIELD_PLACEHOLDER)}
          sx={{
            "& input": {
              textOverflow: "ellipsis",
            },
          }}
        />
        {isFullAdmin ? (
          <LinkButton
            onClick={onClickChangeBillingContact}
            as="button"
            sx={style.LINK_BUTTON}
          >
            {translate(I18N_KEYS.BUTTON)}
          </LinkButton>
        ) : null}
      </div>
      {dialogIsOpen ? (
        <ChangeBillingAdminDialog
          defaultSelected={billingContact}
          handleClose={onClickCloseBillingContactDialog}
          handleConfirmClick={handleSubmitNewBillingContact}
          membersList={teamMembers.data?.members ?? []}
          allMembersCount={teamMembers.data?.members.length ?? 0}
        />
      ) : null}
    </>
  );
};
