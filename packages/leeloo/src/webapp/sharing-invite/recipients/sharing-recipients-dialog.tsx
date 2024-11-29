import { ChangeEventHandler, useRef, useState } from "react";
import { FixedSizeList } from "react-window";
import { Checkbox, Heading, SearchField } from "@dashlane/design-system";
import { DialogBody, DialogFooter } from "@dashlane/ui-components";
import useTranslate from "../../../libs/i18n/useTranslate";
import { sortUsers } from "../helpers";
import { useAcceptedUserGroups } from "../hooks/useAcceptedUserGroups";
import { RecipientsList } from "./recipient-list";
import { sanitizeEmail } from "./utils";
import {
  getGroupsFilteredByQuery,
  getUsersFilteredByQuery,
} from "./recipient-list-helpers";
import { CollectionSharingRoles } from "../../sharing-collection/sharing-collection-recipients";
import {
  useMultiselectContext,
  useMultiselectUpdateContext,
} from "../../list-view/multi-select/multi-select-context";
const I18N_KEYS = {
  CLEAR: "webapp_sharing_invite_clear",
  PLACEHOLDER: "webapp_sharing_invite_recipients_placeholder",
  SHOW_SELECTED: "webapp_sharing_invite_only_show_selected_people",
};
export interface SharingRecipientsDialogProps {
  newUsers?: string[];
  onRolesChanged?: (roles: CollectionSharingRoles[]) => void;
  roles?: CollectionSharingRoles[];
  recipientsOnlyShowSelected: boolean;
  setNewUsers?: (newUsers: string[]) => void;
  setRecipientsOnlyShowSelected: ChangeEventHandler<HTMLInputElement>;
  infobox?: JSX.Element;
  isStarterAdmin?: boolean;
}
interface DialogActions {
  children: string;
  onClick: () => void;
  props?: {
    disabled: boolean;
  };
}
interface Props extends SharingRecipientsDialogProps {
  headingTitle: string;
  emailQueryErrorKey?: string;
  allowNewContacts?: boolean;
  users: any;
  dialogPrimaryAction: DialogActions;
  dialogSecondaryAction?: DialogActions;
}
export const SharingRecipientsDialog = ({
  headingTitle,
  allowNewContacts = false,
  emailQueryErrorKey,
  users,
  dialogPrimaryAction,
  dialogSecondaryAction,
  newUsers = [],
  recipientsOnlyShowSelected,
  setNewUsers,
  setRecipientsOnlyShowSelected,
  infobox,
  isStarterAdmin,
  ...rest
}: Props) => {
  const { translate } = useTranslate();
  const groups = useAcceptedUserGroups();
  const { getSelectedItems } = useMultiselectContext();
  const { toggleSelectedItems } = useMultiselectUpdateContext();
  const [query, setQuery] = useState("");
  const listRef = useRef<FixedSizeList>(null);
  const selectedUsers = getSelectedItems(["users"]);
  const selectedGroups = getSelectedItems(["groups"]);
  const search = (event: React.ChangeEvent<HTMLInputElement>) =>
    setQuery(event.currentTarget.value);
  const addNewContact = (): void => {
    const sanitizedQuery = sanitizeEmail(query);
    setQuery("");
    toggleSelectedItems(new Set([sanitizedQuery]), "users");
    setNewUsers?.(sortUsers([sanitizedQuery, ...newUsers]));
    requestAnimationFrame(() => {
      const recreatedUsersList = [
        ...users,
        ...sortUsers([sanitizedQuery, ...newUsers]).map((newUser) => ({
          id: newUser,
          itemCount: 0,
        })),
      ];
      const newItemIndex =
        groups.length +
        recreatedUsersList.findIndex(({ id }) => id === sanitizedQuery);
      listRef.current?.scrollToItem(newItemIndex);
    });
  };
  const usersList = [
    ...users,
    ...newUsers.map((newUser) => ({ id: newUser, itemCount: 0 })),
  ];
  const hasSelection = selectedGroups.length > 0 || selectedUsers.length > 0;
  const displayCheckbox = hasSelection || recipientsOnlyShowSelected;
  const queriedGroups = getGroupsFilteredByQuery(groups, query);
  const queriedUsers = getUsersFilteredByQuery(usersList, query);
  const hasNoResults = queriedUsers.length === 0 && queriedGroups.length === 0;
  const showEmailQueryError =
    query.length > 0 && hasNoResults && !allowNewContacts && emailQueryErrorKey;
  return (
    <>
      <Heading as="h1" sx={{ mb: "16px" }}>
        {translate(headingTitle)}
      </Heading>
      <DialogBody>
        <div sx={{ height: "auto" }}>
          <section role="search" sx={{ mb: "16px" }}>
            <SearchField
              value={query}
              onChange={search}
              label={translate(I18N_KEYS.PLACEHOLDER)}
              aria-label={translate(I18N_KEYS.PLACEHOLDER)}
              placeholder={translate(I18N_KEYS.PLACEHOLDER)}
              autoFocus
              error={!!showEmailQueryError}
              feedback={
                showEmailQueryError
                  ? {
                      text: translate(emailQueryErrorKey),
                    }
                  : undefined
              }
            />
          </section>
          <RecipientsList
            addNewContact={addNewContact}
            query={query}
            recipientsOnlyShowSelected={recipientsOnlyShowSelected}
            users={usersList}
            ref={listRef}
            allowNewContacts={allowNewContacts}
            isStarterAdmin={isStarterAdmin}
            {...rest}
          />
          {infobox ? infobox : null}
        </div>
      </DialogBody>
      <DialogFooter
        primaryButtonOnClick={dialogPrimaryAction.onClick}
        primaryButtonTitle={translate(dialogPrimaryAction.children)}
        primaryButtonProps={{
          ...dialogPrimaryAction.props,
          type: "button",
        }}
        secondaryButtonOnClick={
          dialogSecondaryAction ? dialogSecondaryAction.onClick : undefined
        }
        secondaryButtonTitle={
          dialogSecondaryAction
            ? translate(dialogSecondaryAction.children)
            : undefined
        }
        secondaryButtonProps={
          dialogSecondaryAction ? dialogSecondaryAction.props : undefined
        }
      >
        {displayCheckbox && (
          <Checkbox
            checked={recipientsOnlyShowSelected}
            onChange={setRecipientsOnlyShowSelected}
            label={translate(I18N_KEYS.SHOW_SELECTED)}
            sx={{ ml: "0", mr: "auto", pr: "16px" }}
          />
        )}
      </DialogFooter>
    </>
  );
};
