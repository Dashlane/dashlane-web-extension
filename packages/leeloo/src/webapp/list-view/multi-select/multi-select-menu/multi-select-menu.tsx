import { useEffect } from "react";
import { Button } from "@dashlane/design-system";
import useTranslate from "../../../../libs/i18n/useTranslate";
import {
  useLocation,
  useRouterGlobalSettingsContext,
} from "../../../../libs/router";
import {
  SelectableItemType,
  useMultiselectContext,
  useMultiselectUpdateContext,
} from "../multi-select-context";
import { DeleteAction } from "./delete-action";
import { MenuRow } from "./menu-row";
import { useBulkDeletion } from "../../../credentials/list/bulk-deletion";
import { useCredentialsContext } from "../../../credentials/credentials-view/credentials-context";
const I18N_KEYS = {
  SELECTED_LOGINS: "webapp_credentials_multiselect_selected_count",
  CANCEL_BUTTON: "webapp_credentials_multiselect_menu_close_button",
};
export const MultiSelectMenu = ({ type }: { type: SelectableItemType }) => {
  const { translate } = useTranslate();
  const { isSelected, getSelectedItems } = useMultiselectContext();
  const { credentials } = useCredentialsContext();
  const { clearSelection } = useMultiselectUpdateContext();
  const { openBulkDeletionDialog } = useBulkDeletion();
  const { routes } = useRouterGlobalSettingsContext();
  const { pathname } = useLocation();
  const selectedItemsLength = getSelectedItems([type]).length;
  const deleteSelected = () => {
    const selectedItems = credentials.filter((credential) =>
      isSelected(credential.id, type)
    );
    openBulkDeletionDialog(selectedItems, clearSelection);
  };
  useEffect(() => {
    const deleteKeyHandler = (event: KeyboardEvent) => {
      const { key } = event;
      if (
        (key === "Backspace" || key === "Delete") &&
        selectedItemsLength > 0 &&
        pathname === routes.userCredentials
      ) {
        deleteSelected();
      }
    };
    document.addEventListener("keydown", deleteKeyHandler);
    return () => {
      document.removeEventListener("keydown", deleteKeyHandler);
    };
  }, [selectedItemsLength, pathname]);
  return (
    <MenuRow visible={selectedItemsLength > 0}>
      <span>
        {translate(I18N_KEYS.SELECTED_LOGINS, {
          count: selectedItemsLength || 1,
        })}
      </span>
      <ul
        sx={{
          display: "flex",
          gap: "16px",
          alignItems: "center",
          marginLeft: "auto",
        }}
      >
        <li>
          <DeleteAction onClick={deleteSelected} />
        </li>
        <li>
          <Button
            size="small"
            mood="neutral"
            intensity="quiet"
            icon="ActionCloseOutlined"
            aria-label={translate(I18N_KEYS.CANCEL_BUTTON)}
            tooltip={translate(I18N_KEYS.CANCEL_BUTTON)}
            layout="iconOnly"
            onClick={clearSelection}
            data-testid="closeButton"
          />
        </li>
      </ul>
    </MenuRow>
  );
};
