import React from 'react';
import { Link } from 'libs/router';
import { PaymentCard, PaymentCardColorType } from '@dashlane/vault-contracts';
import { colors } from '@dashlane/ui-components';
import useTranslate from 'libs/i18n/useTranslate';
import getBackgroundColorForCard from 'webapp/payment-card-icon/getBackgroundColorForPaymentCard';
import { getDisplayedCardNumber, getExpirationDate, } from 'webapp/payments/payment-cards/utils';
import styles from './payment-card-grid-item.css';
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
export const PaymentCardGridItem = ({ item, linkTo, onClick, }: PaymentCardGridItemProps) => {
    const { translate } = useTranslate();
    const { cardNumber, color, expireMonth, expireYear, id, itemName, ownerName, } = item;
    const expirationDateLabel = translate('payments_grid_payment_card_expires');
    const expirationDate = getExpirationDate(expireMonth, expireYear);
    const backgroundColor = getBackgroundColor(color);
    const borderColor = getBorderColor(color);
    const foregroundColor = getForegroundColor(color);
    const opfuscatedCardNumber = getDisplayedCardNumber(cardNumber);
    return (<Link className={styles.paymentCard} style={{ backgroundColor, borderColor, color: foregroundColor }} to={linkTo ? linkTo(id) : ''} onClick={onClick}>
      <div className={styles.itemInner}>
        <div className={styles.paymentCardNumber}>{opfuscatedCardNumber}</div>
        <div className={styles.paymentCardDateAndName}>
          {expirationDate ? (<span className={styles.paymentCardExpirationDate}>
              <span className={styles.paymentCardExpirationDateLabel}>
                {expirationDateLabel}
              </span>
              <span className={styles.paymentCardExpirationDateValue}>
                {expirationDate}
              </span>
            </span>) : null}
          {itemName ? <span>{itemName}</span> : null}
        </div>
        {ownerName ? (<div className={styles.paymentCardOwnerName}>{ownerName}</div>) : null}
      </div>
    </Link>);
};
