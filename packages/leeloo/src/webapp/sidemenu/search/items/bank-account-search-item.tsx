import {
  AllowedThumbnailIcons,
  colors,
  Thumbnail,
} from "@dashlane/ui-components";
import { BankAccount } from "@dashlane/vault-contracts";
import classNames from "classnames";
import { Link } from "../../../../libs/router";
import { CSSProperties, DragEvent, useState } from "react";
import { BankAccountActions } from "../../../payments/bank-accounts/bank-account-actions/bank-account-actions";
import { BankAccountActionsMode } from "../../../payments/bank-accounts/bank-account-actions/types";
import { editPanelIgnoreClickOutsideClassName } from "../../../variables";
import styles from "./styles.css";
interface BankAccountSearchItemProps {
  bankAccount: BankAccount;
  getRoute: (id: string) => string;
  style?: CSSProperties;
  onSelectBankAccount: () => void;
}
const preventDragAndDrop = (e: DragEvent<HTMLElement>) => e.preventDefault();
export const BankAccountSearchItem = ({
  bankAccount,
  onSelectBankAccount,
  getRoute,
  style,
}: BankAccountSearchItemProps) => {
  const [copyDropdownIsOpen, setCopyDropdownIsOpen] = useState(false);
  const { dashGreen00 } = colors;
  const { accountName, id, ownerName } = bankAccount;
  return (
    <div style={style}>
      <div
        className={classNames(
          styles.item,
          editPanelIgnoreClickOutsideClassName
        )}
        onMouseLeave={() => {
          if (copyDropdownIsOpen) {
            setCopyDropdownIsOpen(false);
          }
        }}
      >
        <Link
          onClick={onSelectBankAccount}
          to={getRoute(id)}
          className={styles.link}
          onDragStart={preventDragAndDrop}
          onDrop={preventDragAndDrop}
        >
          <div className={styles.logoCell}>
            <Thumbnail
              size="small"
              icon={AllowedThumbnailIcons.Bank}
              backgroundColor={dashGreen00}
            />
          </div>
          <div className={styles.info}>
            <div className={styles.title}>{accountName}</div>
            <div className={styles.name}>{ownerName}</div>
          </div>
        </Link>
        <div className={styles.actions}>
          <BankAccountActions
            bankAccount={bankAccount}
            dropdownIsOpen={copyDropdownIsOpen}
            setDropdownIsOpen={setCopyDropdownIsOpen}
            mode={BankAccountActionsMode.SEARCH}
          />
        </div>
      </div>
    </div>
  );
};
