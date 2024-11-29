import {
  HorizontalNavButton,
  HorizontalNavMenu,
} from "@dashlane/ui-components";
import useTranslate from "../../../libs/i18n/useTranslate";
import { ItemsTabs } from "../types";
import { useHasSecretManagement } from "../../secrets/hooks/use-has-secret-management";
const I18N_KEYS = {
  NOTES: "webapp_sharing_invite_secure_notes",
  PASSWORDS: "webapp_sharing_invite_passwords",
  SECRETS: "webapp_sharing_invite_secrets",
};
export interface ElementsStepTabsProps {
  selectedCredentials: string[];
  selectedNotes: string[];
  selectedSecrets: string[];
  selectNotesTab: () => void;
  selectPasswordsTab: () => void;
  selectSecretsTab: () => void;
  tab: ItemsTabs;
}
const buildTabConfig = (
  onClick: () => void,
  isActive: boolean,
  prefix: string,
  suffix: string
): {
  onClick: () => void;
  active: boolean;
  label: string;
} => ({
  onClick: onClick,
  active: isActive,
  label: `${prefix}${suffix}`,
});
export const ElementsStepTabs = ({
  selectedCredentials,
  selectedNotes,
  selectedSecrets,
  selectNotesTab,
  selectPasswordsTab,
  selectSecretsTab,
  tab,
}: ElementsStepTabsProps) => {
  const { translate } = useTranslate();
  const hasSecretManagement = useHasSecretManagement();
  const tabs = [
    buildTabConfig(
      selectPasswordsTab,
      tab === ItemsTabs.Passwords,
      translate(I18N_KEYS.PASSWORDS),
      selectedCredentials.length > 0 ? ` (${selectedCredentials.length})` : ""
    ),
    buildTabConfig(
      selectNotesTab,
      tab === ItemsTabs.SecureNotes,
      translate(I18N_KEYS.NOTES),
      selectedNotes.length > 0 ? ` (${selectedNotes.length})` : ""
    ),
  ];
  if (hasSecretManagement) {
    tabs.push(
      buildTabConfig(
        selectSecretsTab,
        tab === ItemsTabs.Secrets,
        translate(I18N_KEYS.SECRETS),
        selectedSecrets.length > 0 ? ` (${selectedSecrets.length})` : ""
      )
    );
  }
  return (
    <HorizontalNavMenu>
      {tabs.map(({ active, label, onClick }) => (
        <HorizontalNavButton
          key={label}
          label={label}
          onClick={onClick}
          selected={active}
        />
      ))}
    </HorizontalNavMenu>
  );
};
