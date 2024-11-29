import { VaultHeaderWithDropdown } from "../components/header/vault-header-with-dropdown";
import { HeaderAccountMenu } from "../components/header/header-account-menu";
import { Connected as NotificationsDropdown } from "../bell-notifications/connected";
import { PersonalInfoAddDropdown } from "./personal-info-add-dropdown";
export const PersonalInfoHeader = () => {
  const endWidget = (
    <>
      <HeaderAccountMenu />
      <NotificationsDropdown />
    </>
  );
  return (
    <VaultHeaderWithDropdown
      dropdown={<PersonalInfoAddDropdown />}
      endWidget={endWidget}
    />
  );
};
