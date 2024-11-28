import * as React from "react";
import {
  BankIcon,
  colors,
  IdIcon,
  NotesIcon,
  PasswordsIcon,
  PersonalInfoIcon,
} from "@dashlane/ui-components";
import { VaultItemType } from "@dashlane/vault-contracts";
import useTranslate from "../../../../../../../libs/i18n/useTranslate";
import { VaultTabType } from "../../../../../types";
import styles from "./styles.css";
const I18N_KEYS = {
  NO_CREDENTIALS_PLACEHOLDER: "tab/all_items/no_credentials_placeholder",
  NO_ITEMS_PLACEHOLDER: "tab/all_items/no_items_placeholder",
};
interface EmptyVaultItemsListProps {
  vaultTabType: VaultTabType;
}
const getKey = (vaultTabType: VaultTabType) =>
  vaultTabType === VaultTabType.Credentials
    ? I18N_KEYS.NO_CREDENTIALS_PLACEHOLDER
    : I18N_KEYS.NO_ITEMS_PLACEHOLDER;
export const EmptyVaultItemsList = ({
  vaultTabType,
}: EmptyVaultItemsListProps) => {
  const { translate } = useTranslate();
  const vaultIcons: Record<VaultTabType, JSX.Element> = {
    [VaultTabType.Credentials]: (
      <PasswordsIcon size={96} color={colors.grey04} />
    ),
    [VaultTabType.SecureNotes]: <NotesIcon size={96} color={colors.grey04} />,
    [VaultTabType.Payments]: <BankIcon size={96} color={colors.grey04} />,
    [VaultTabType.Identities]: <IdIcon size={96} color={colors.grey04} />,
    [VaultTabType.PersonalInformation]: (
      <PersonalInfoIcon size={96} color={colors.grey04} />
    ),
  };
  return (
    <div className={styles.emptyVaultItemsList}>
      <div className={styles.icon}>{vaultIcons[vaultTabType]}</div>
      <p className={styles.explanation}>{translate(getKey(vaultTabType))}</p>
    </div>
  );
};
