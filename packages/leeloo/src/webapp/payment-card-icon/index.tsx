import React from "react";
import classnames from "classnames";
import { PaymentCardColorType } from "@dashlane/vault-contracts";
import PaymentIcon from "./icons/payments.svg?inline";
import CardIcon from "./icons/card.svg?inline";
import WhiteCardIcon from "./icons/white-card.svg?inline";
import getBackgroundColorForCard from "./getBackgroundColorForPaymentCard";
import styles from "./styles.css";
interface Props {
  className?: string;
  paymentCardColor?: PaymentCardColorType;
  iconSize: "large" | "small";
}
const PaymentCardIcon = (props: Props) => {
  const isCardWhite = props.paymentCardColor === PaymentCardColorType.White;
  const backgroundColor = getBackgroundColorForCard(props.paymentCardColor);
  const smallIcon = isCardWhite ? (
    <WhiteCardIcon />
  ) : (
    <CardIcon fill={backgroundColor} />
  );
  const largeIcon = (
    <div
      className={classnames(styles.iconWrapper, props.className, {
        [styles.hasWhiteBg]: isCardWhite,
      })}
    >
      <PaymentIcon className={styles.icon} />
    </div>
  );
  return props.iconSize === "large" ? largeIcon : smallIcon;
};
export default PaymentCardIcon;
