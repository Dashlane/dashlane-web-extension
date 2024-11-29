import * as React from "react";
import classNames from "classnames";
import { EnhancedWebcardItem } from "@dashlane/autofill-engine/types";
import { VaultSourceType } from "@dashlane/autofill-contracts";
import {
  Badge,
  Button,
  HighlightText,
  Icon,
  jsx,
  ListItem,
  mergeSx,
} from "@dashlane/design-system";
import { I18nContext } from "../../../context/i18n";
import { KEYBOARD_EVENTS } from "../../../constants";
import { MORE_BUTTON_CLASS, SX_STYLES } from "./Items.styles";
import styles from "./EnhancedSelectionItem.module.scss";
const I18N_KEYS = {
  ABOUT_TO_EXPIRE: "aboutToExpire",
  EXPIRED: "expired",
  INCOMPLETE: "incomplete",
};
interface Props {
  item: EnhancedWebcardItem;
  onClick: (item: EnhancedWebcardItem) => void;
  onClickMoreButton?: (item: EnhancedWebcardItem) => void;
  searchValue?: string;
  showIcon?: boolean;
}
enum PaymentCardNetwork {
  DINERSCLUB = "PAYMENT_TYPE_DINERSCLUB",
  DISCOVER = "PAYMENT_TYPE_DISCOVER",
  JCB = "PAYMENT_TYPE_JCB",
  MASTERCARD = "PAYMENT_TYPE_MASTERCARD",
  VISA = "PAYMENT_TYPE_VISA",
}
const getIconClass = (itemType: VaultSourceType, displayCountry?: string) => {
  switch (itemType) {
    case VaultSourceType.IdCard:
      if (displayCountry && displayCountry === "FR") {
        return styles.idFr;
      }
      return styles.idGeneric;
    case VaultSourceType.Passport:
      return styles.passport;
    case VaultSourceType.SocialSecurityId:
      switch (displayCountry) {
        case "FR":
          return styles.ssnFr;
        case "GB":
          return styles.ssnGb;
        case "US":
          return styles.ssnUs;
        default:
          return styles.ssnGeneric;
      }
    case VaultSourceType.DriverLicense:
      return styles.driversLicense;
    case VaultSourceType.FiscalId:
      return styles.taxNumber;
    case VaultSourceType.BankAccount:
      return styles.bankStatement;
    case VaultSourceType.PaymentCard:
      return styles.paymentCard;
    default:
      return null;
  }
};
const getPaymentCardNetworkIconClass = (paymentType: string) => {
  switch (paymentType) {
    case PaymentCardNetwork.DINERSCLUB:
      return styles.paymentCardNetworkDinersClub;
    case PaymentCardNetwork.DISCOVER:
      return styles.paymentCardNetworkDiscover;
    case PaymentCardNetwork.JCB:
      return styles.paymentCardNetworkJCB;
    case PaymentCardNetwork.MASTERCARD:
      return styles.paymentCardNetworkMastercard;
    case PaymentCardNetwork.VISA:
      return styles.paymentCardNetworkVisa;
    default:
      return null;
  }
};
export const EnhancedSelectionItem = ({
  item,
  onClick,
  onClickMoreButton,
  searchValue,
  showIcon,
}: Props) => {
  const { translate } = React.useContext(I18nContext);
  const {
    itemId,
    itemType,
    title,
    content,
    expired,
    aboutToExpire,
    incomplete,
    displayCountry,
    country,
    backgroundName,
    paymentType,
    color,
  } = item;
  const chosenCountry = displayCountry || country;
  let driverLicenseType = "";
  if (itemType === VaultSourceType.DriverLicense) {
    driverLicenseType =
      country === "FR" || backgroundName === "eu" ? "european" : "generic";
  }
  const iconClass = getIconClass(itemType, chosenCountry);
  const paymentCardNetworkIconClass = getPaymentCardNetworkIconClass(
    paymentType ?? ""
  );
  let warning = "";
  if (expired) {
    warning = translate(I18N_KEYS.EXPIRED);
  } else if (aboutToExpire) {
    warning = translate(I18N_KEYS.ABOUT_TO_EXPIRE);
  } else if (incomplete) {
    warning = translate(I18N_KEYS.INCOMPLETE);
  }
  return (
    <ListItem
      key={itemId}
      onClick={() => onClick(item)}
      aria-label={`${title}: ${content}`}
    >
      <div
        sx={SX_STYLES.ITEM}
        onKeyUp={(e) => {
          if (
            e.key !== KEYBOARD_EVENTS.ENTER &&
            e.key !== KEYBOARD_EVENTS.SPACE
          ) {
            return;
          }
          onClick(item);
        }}
        role="button"
        tabIndex={0}
        data-keyboard-accessible={`${title}: ${content}`}
        data-testid={itemId}
      >
        {showIcon && itemType === VaultSourceType.BankAccount ? (
          <div sx={SX_STYLES.ICON_CONTAINER}>
            <Icon name={"ItemBankAccountOutlined"} size="large" />
          </div>
        ) : null}
        {showIcon && itemType !== VaultSourceType.BankAccount ? (
          <div
            sx={SX_STYLES.ICON_CONTAINER}
            className={classNames(
              iconClass,
              chosenCountry && styles[chosenCountry],
              driverLicenseType && styles[driverLicenseType],
              color && styles[color]
            )}
          ></div>
        ) : null}
        <div
          sx={mergeSx([
            SX_STYLES.CONTENT,
            warning ? SX_STYLES.WITH_WARNING : {},
          ])}
        >
          <div data-testid="item-title" sx={SX_STYLES.TITLE}>
            <div sx={SX_STYLES.TITLE_BADGE_CONTAINER}>
              <div sx={{ overflow: "hidden", textOverflow: "ellipsis" }}>
                <HighlightText
                  text={title ?? ""}
                  highlightedText={searchValue}
                />
              </div>
              {warning ? (
                <Badge
                  mood="warning"
                  intensity="quiet"
                  label={warning}
                  sx={{ marginLeft: "5px" }}
                />
              ) : null}
            </div>
          </div>
          {content ? (
            <div sx={SX_STYLES.SUBTITLE}>
              {paymentCardNetworkIconClass ? (
                <div
                  className={classNames(
                    styles.paymentCardNetworkContainer,
                    paymentCardNetworkIconClass
                  )}
                />
              ) : null}
              <HighlightText text={content} highlightedText={searchValue} />
            </div>
          ) : null}
        </div>
        {onClickMoreButton ? (
          <Button
            type="button"
            mood="neutral"
            intensity="supershy"
            size="small"
            layout="iconOnly"
            className={MORE_BUTTON_CLASS}
            onClick={(e) => {
              e.stopPropagation();
              onClickMoreButton(item);
            }}
            icon={<Icon name="CaretRightOutlined" aria-hidden />}
            data-keyboard-accessible
          />
        ) : null}
      </div>
    </ListItem>
  );
};
