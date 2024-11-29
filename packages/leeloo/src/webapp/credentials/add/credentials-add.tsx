import { DataStatus } from "@dashlane/framework-react";
import { useSpaces } from "../../../libs/carbon/hooks/useSpaces";
import { useProtectedItemsUnlocker } from "../../unlock-items";
import { CredentialAddPanelComponent } from "./credentials-add-component";
interface Props {
  onClose: () => void;
}
export const CredentialAddPanel = (props: Props) => {
  const activeSpacesResult = useSpaces();
  const unlockerProps = useProtectedItemsUnlocker();
  if (activeSpacesResult.status !== DataStatus.Success) {
    return null;
  }
  return (
    <CredentialAddPanelComponent
      {...props}
      activeSpaces={activeSpacesResult.data}
      {...unlockerProps}
    />
  );
};
