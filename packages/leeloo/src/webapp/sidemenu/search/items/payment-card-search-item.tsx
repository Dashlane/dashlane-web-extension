import * as React from "react";
import { Link } from "../../../../libs/router";
import classNames from "classnames";
import { PaymentCard } from "@dashlane/vault-contracts";
import PaymentCardIcon from "../../../payment-card-icon";
import { editPanelIgnoreClickOutsideClassName } from "../../../variables";
import { getDisplayedCardNumber } from "../../../payments/payment-cards/utils";
import styles from "./styles.css";
interface PaymentCardSearchItemProps {
  paymentCard: PaymentCard;
  getRoute: (id: string) => string;
  style?: React.CSSProperties;
  onSelectPaymentCard: () => void;
}
const preventDragAndDrop = (e: React.DragEvent<HTMLElement>) =>
  e.preventDefault();
export const PaymentCardSearchItem = ({
  paymentCard,
  onSelectPaymentCard,
  getRoute,
  style,
}: PaymentCardSearchItemProps) => {
  const { color, id, cardNumber, itemName } = paymentCard;
  const displayCardNumber = getDisplayedCardNumber(cardNumber);
  return (
    <div className={styles.container} style={style}>
      <div
        className={classNames(
          styles.item,
          editPanelIgnoreClickOutsideClassName
        )}
      >
        <Link
          onClick={() => {
            onSelectPaymentCard();
          }}
          to={getRoute(id)}
          className={styles.link}
          onDragStart={preventDragAndDrop}
          onDrop={preventDragAndDrop}
        >
          <div className={styles.logoCell}>
            <PaymentCardIcon
              iconSize="small"
              paymentCardColor={color}
              className={styles.icon}
            />
          </div>
          <div className={styles.info}>
            <div className={styles.title}>{itemName}</div>
            <div className={styles.name}>{displayCardNumber}</div>
          </div>
        </Link>
      </div>
    </div>
  );
};
