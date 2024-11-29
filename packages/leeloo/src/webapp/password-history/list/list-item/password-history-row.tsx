import {
  CredentialPasswordHistoryItemView,
  PasswordHistoryItemView,
} from "@dashlane/communication";
import { Permission } from "@dashlane/sharing-contracts";
import { useProtectPasswordsSetting } from "../../../../libs/carbon/hooks/useProtectPasswordsSetting";
import Row from "../../../list-view/row";
import { formatPasswordHistoryItem, isItemPasswordProtected } from "../helpers";
import { PasswordCopyHandlerParams } from "../../types";
interface Props {
  item: PasswordHistoryItemView;
  sharingStatus: {
    isShared: boolean;
    permission?: Permission;
  };
  onPasswordCopied: (copyHandlerParams: PasswordCopyHandlerParams) => void;
  onCreateNewCredential: (generatedPassword: string, website?: string) => void;
  onOpenRestorePasswordDialog: (
    newSelectedItem: CredentialPasswordHistoryItemView
  ) => void;
}
export const PasswordHistoryRow = ({
  item,
  sharingStatus,
  onPasswordCopied,
  onCreateNewCredential,
  onOpenRestorePasswordDialog,
}: Props) => {
  const mpSettingsResponse = useProtectPasswordsSetting();
  const isProtected = isItemPasswordProtected(item, mpSettingsResponse);
  const content = formatPasswordHistoryItem(
    item,
    onPasswordCopied,
    isProtected,
    onCreateNewCredential,
    onOpenRestorePasswordDialog,
    sharingStatus
  );
  return <Row {...content} key={item.id} />;
};
