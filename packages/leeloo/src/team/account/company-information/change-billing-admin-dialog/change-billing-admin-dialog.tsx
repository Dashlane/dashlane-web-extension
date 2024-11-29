import { ChangeEventHandler, useEffect, useState } from "react";
import { GridContainer } from "@dashlane/ui-components";
import {
  Badge,
  Dialog,
  LinkButton,
  Paragraph,
  SearchField,
} from "@dashlane/design-system";
import { GetMembersQueryResult } from "@dashlane/team-admin-contracts";
import {
  RadioButton,
  RadioButtonGroup,
} from "../../../../libs/dashlane-style/radio-button";
import useTranslate from "../../../../libs/i18n/useTranslate";
import { Link, useRouterGlobalSettingsContext } from "../../../../libs/router";
import { MemberData } from "../../../members/types";
export const normalize = (s: string) => {
  return s.trim().toLocaleLowerCase();
};
type TeamMember = MemberData | GetMembersQueryResult["members"][number];
const search = (members: TeamMember[], searchString: string) => {
  if (searchString.trim() === "") {
    return members;
  }
  return members.filter(({ login }) =>
    normalize(login).includes(normalize(searchString))
  );
};
export const I18N_KEYS = {
  CONFIRM: "team_account_billing_admin_dialog_confirm",
  DIALOG_TITLE: "team_account_billing_admin_dialog_title",
  SEARCH_FIELD_PLACEHOLDER:
    "team_account_billing_admin_search_field_placeholder",
  SEARCH_MATCH_COUNT: "team_account_billing_admin_search_results_count",
  SEARCH_NO_MATCH: "team_account_billing_admin_search_no_match",
  WARNING: "team_account_billing_admin_dialog_warning",
  SEARCH_HELP_QUESTION: "team_account_billing_admin_help",
  SEARCH_HELP_LINK_TO_USERS_PAGE:
    "team_account_billing_admin_link_to_members_page",
  CLOSE_DIALOG: "_common_dialog_dismiss_button",
  ADMIN: "team_members_row_captain",
  GROUP_MANAGER: "team_members_row_group_manager",
};
const getRightsLabel = (member: TeamMember): string | null => {
  if (member.isTeamCaptain) {
    return I18N_KEYS.ADMIN;
  }
  if (member.isGroupManager) {
    return I18N_KEYS.GROUP_MANAGER;
  }
  return null;
};
interface ConfirmDialogProps {
  defaultSelected: string;
  handleClose: () => void;
  handleConfirmClick: (val: string) => Promise<void>;
  membersList: TeamMember[];
  allMembersCount: number;
}
export const ChangeBillingAdminDialog = ({
  defaultSelected,
  handleConfirmClick,
  handleClose,
  allMembersCount,
  membersList,
}: ConfirmDialogProps) => {
  const { translate } = useTranslate();
  const { routes } = useRouterGlobalSettingsContext();
  const [selectedAdmin, setSelectedAdmin] = useState(defaultSelected);
  const [searchValue, setSearchValue] = useState("");
  const [filteredMembers, setFilteredMembers] = useState<TeamMember[]>([]);
  const [searchStarted, setSearchStarted] = useState(false);
  const handleSearchChange: ChangeEventHandler<HTMLInputElement> = ({
    target: { value },
  }) => {
    setSearchValue(value);
    if (!searchStarted) {
      setSearchStarted(true);
    }
  };
  const handleBillingSelection: ChangeEventHandler<HTMLInputElement> = ({
    target: { value },
  }) => {
    setSelectedAdmin(value);
  };
  useEffect(() => {
    setFilteredMembers(search(membersList, searchValue).slice(0, 5));
  }, [membersList, searchValue]);
  const primaryButtonOnClick = () => handleConfirmClick(selectedAdmin);
  const submitDisabled =
    !filteredMembers.length || defaultSelected === selectedAdmin;
  return (
    <Dialog
      isOpen
      title={translate(I18N_KEYS.DIALOG_TITLE)}
      actions={{
        primary: {
          children: translate(I18N_KEYS.CONFIRM),
          onClick: primaryButtonOnClick,
          disabled: submitDisabled,
        },
      }}
      onClose={handleClose}
      closeActionLabel={translate(I18N_KEYS.CLOSE_DIALOG)}
    >
      <GridContainer gap="1.5em" gridTemplateColumns="auto">
        <Paragraph color="ds.text.neutral.quiet">
          {translate(I18N_KEYS.WARNING)}
        </Paragraph>
        <SearchField
          autoFocus
          onChange={handleSearchChange}
          label={translate(I18N_KEYS.SEARCH_FIELD_PLACEHOLDER)}
          placeholder={translate(I18N_KEYS.SEARCH_FIELD_PLACEHOLDER)}
        />
        {filteredMembers.length > 0 ? (
          <>
            <Paragraph color="ds.text.neutral.quiet">
              {translate(I18N_KEYS.SEARCH_MATCH_COUNT, {
                count: filteredMembers.length,
                totalCount: allMembersCount,
              })}
            </Paragraph>
            <RadioButtonGroup
              value={selectedAdmin}
              onChange={handleBillingSelection}
              groupName="billingAdmins"
            >
              {filteredMembers.map((member) => {
                const { login } = member;
                const rightsLabel = getRightsLabel(member);
                return (
                  <RadioButton key={login} value={login}>
                    <div sx={{ display: "flex", gap: "6px" }}>
                      {login}
                      {rightsLabel ? (
                        <Badge label={translate(rightsLabel)} />
                      ) : null}
                    </div>
                  </RadioButton>
                );
              })}
            </RadioButtonGroup>
            {filteredMembers.length < allMembersCount ? (
              <div
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  gap: "8px",
                  alignItems: "center",
                }}
              >
                <Paragraph color="ds.text.neutral.quiet">
                  {translate(I18N_KEYS.SEARCH_HELP_QUESTION)}
                </Paragraph>
                <LinkButton
                  as={Link}
                  to={routes.teamMembersRoutePath}
                  onClick={handleClose}
                >
                  {translate(I18N_KEYS.SEARCH_HELP_LINK_TO_USERS_PAGE)}
                </LinkButton>
              </div>
            ) : null}
          </>
        ) : null}
        {filteredMembers.length === 0 ? (
          <Paragraph>{translate(I18N_KEYS.SEARCH_NO_MATCH)}</Paragraph>
        ) : null}
      </GridContainer>
    </Dialog>
  );
};
