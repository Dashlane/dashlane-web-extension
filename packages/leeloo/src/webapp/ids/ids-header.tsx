import { CurrentLocationUpdated } from "@dashlane/communication";
import { VaultHeaderWithDropdown } from "../components/header/vault-header-with-dropdown";
import { IdsAddDropdown } from "./ids-add-dropdown";
import { Connected as NotificationsDropdown } from "../bell-notifications/connected";
import { HeaderAccountMenu } from "../components/header/header-account-menu";
interface Props {
  currentLocation: CurrentLocationUpdated;
}
export const IdsHeader = ({ currentLocation }: Props) => {
  const endWidget = (
    <>
      <HeaderAccountMenu />
      <NotificationsDropdown />
    </>
  );
  return (
    <VaultHeaderWithDropdown
      dropdown={<IdsAddDropdown currentLocation={currentLocation} />}
      endWidget={endWidget}
    />
  );
};
