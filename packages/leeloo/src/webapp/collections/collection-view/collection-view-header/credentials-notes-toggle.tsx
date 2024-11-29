import { Button, DSStyleObject } from "@dashlane/design-system";
import useTranslate from "../../../../libs/i18n/useTranslate";
import { ItemsTabs } from "../../../sharing-invite/types";
const ACTIVE_BUTTON_SX = {
  background: "ds.container.agnostic.neutral.supershy",
  borderRadius: "10px",
  boxShadow: "0 0 3px 0 rgba(0, 0, 0, 0.04), 0 1px 2px 0 rgba(0, 0, 0, 0.08)",
  cursor: "default",
  margin: "0 2px",
  ":hover:enabled, :active:enabled, :focus:enabled": {
    background: "ds.container.agnostic.neutral.supershy",
  },
};
const INACTIVE_BUTTON_SX = { borderRadius: "10px", margin: "0 2px" };
type CredentialsNotesToggleProps = {
  isNotesViewDisplayed: boolean;
  setTab: (tab: ItemsTabs) => void;
  additionalStyle?: DSStyleObject;
};
export const CredentialsNotesToggle = ({
  isNotesViewDisplayed,
  setTab,
  additionalStyle,
}: CredentialsNotesToggleProps) => {
  const { translate } = useTranslate();
  return (
    <div
      sx={{
        background: "ds.container.expressive.neutral.quiet.disabled",
        borderRadius: "10px",
        margin: "0 32px",
        padding: "4px 2px",
        width: "fit-content",
        ...additionalStyle,
      }}
    >
      <Button
        onClick={() => setTab(ItemsTabs.Passwords)}
        intensity="supershy"
        mood={isNotesViewDisplayed ? "neutral" : "brand"}
        sx={isNotesViewDisplayed ? INACTIVE_BUTTON_SX : ACTIVE_BUTTON_SX}
      >
        {translate("webapp_sidemenu_item_passwords")}
      </Button>
      <Button
        onClick={() => setTab(ItemsTabs.SecureNotes)}
        intensity="supershy"
        mood={!isNotesViewDisplayed ? "neutral" : "brand"}
        sx={!isNotesViewDisplayed ? INACTIVE_BUTTON_SX : ACTIVE_BUTTON_SX}
      >
        {translate("webapp_sidemenu_item_secure_notes")}
      </Button>
    </div>
  );
};
