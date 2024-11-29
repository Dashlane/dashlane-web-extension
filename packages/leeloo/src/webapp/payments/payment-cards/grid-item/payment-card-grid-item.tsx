import React from "react";
import { Link } from "../../../../libs/router";
import { PaymentCard, PaymentCardColorType } from "@dashlane/vault-contracts";
import { colors } from "@dashlane/ui-components";
import useTranslate from "../../../../libs/i18n/useTranslate";
import getBackgroundColorForCard from "../../../payment-card-icon/getBackgroundColorForPaymentCard";
import { getDisplayedCardNumber, __REDACTED__ } from "../utils";
import styles from "./payment-card-grid-item.css";
const getBorderColor = (itemColorType: PaymentCardColorType) => {
  return itemColorType === PaymentCardColorType.White
    ? colors.grey05
    : getBackgroundColorForCard(itemColorType);
};
const getForegroundColor = (itemColorType: PaymentCardColorType) => {
  return itemColorType === PaymentCardColorType.White
    ? colors.grey00
    : colors.white;
};
const getBackgroundColor = (itemColorType: PaymentCardColorType) => {
  return getBackgroundColorForCard(itemColorType);
};
export interface PaymentCardGridItemProps {
  item: PaymentCard;
  linkTo?: (uuid: string) => string;
  onClick?: (event: React.MouseEvent<HTMLAnchorElement>) => void;
}
