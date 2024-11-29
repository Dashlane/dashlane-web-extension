import { VaultHeaderWithDropdown } from "../components/header/vault-header-with-dropdown";
import { HeaderAccountMenu } from "../components/header/header-account-menu";
import { Connected as NotificationsDropdown } from "../bell-notifications/connected";
import { PaymentsAddDropdown } from "./payments-add-dropdown";
export const PaymentsHeader = () => {
  const endWidget = (
    <>
      <HeaderAccountMenu />
      <NotificationsDropdown />
    </>
  );
  return (
    <VaultHeaderWithDropdown
      dropdown={<PaymentsAddDropdown />}
      endWidget={endWidget}
    />
  );
};
