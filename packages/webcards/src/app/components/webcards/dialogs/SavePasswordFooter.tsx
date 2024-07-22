import * as React from "react";
import classNames from "classnames";
import { Icon, Infobox, jsx } from "@dashlane/design-system";
import { WebcardItem } from "@dashlane/autofill-engine/dist/autofill-engine/src/types";
import { KEYBOARD_EVENTS } from "../../../constants";
import { getPremiumPricingUrl } from "../../../utils/webApp/url";
import { I18nContext } from "../../../context/i18n";
import { SecondaryActionButton } from "../../common/generic/buttons/SecondaryActionButton";
import { PrimaryActionButton } from "../../common/generic/buttons/PrimaryActionButton";
import { PrimarySubmitButton } from "../../common/generic/buttons/PrimarySubmitButton";
import { SX_STYLES as ITEMS_SX_STYLES } from "../../common/items/Items.styles";
import styles from "./SavePassword.module.scss";
const SX_STYLES = {
  ADD_NEW_LOGIN_TITLE: {
    color: "ds.text.neutral.catchy",
  },
  MORE_BUTTON: {
    color: "ds.text.neutral.quiet",
    "&:hover": { color: "ds.text.neutral.catchy" },
  },
};
const I18N_KEYS = {
  CREATE_NEW_LOGIN: "createNewLogin",
  CLOSE_MORE_OPTIONS: "collapse",
  OPEN_MORE_OPTIONS: "moreOptions",
  CANCEL: "cancel",
  REPLACE: "replace",
  UPGRADE_TO_PREMIUM: "upgradeToPremium",
  PASSWORD_LIMITED_TITLE: "passwordLimitReachedTitleReplace",
  BUY_DASHLANE: "footerBuyDashlane",
  DISMISS: "footerDismiss",
};
interface Props {
  isReplaceWebcardFormat: boolean;
  isLimited: boolean;
  isB2BDiscontinued: boolean;
  displayExtraInfo: boolean;
  emailOrLogin: string;
  formId: string;
  saveButtonRef: React.RefObject<HTMLButtonElement>;
  mainButtonLabel: string;
  withExtraInfoButton: boolean;
  accountSubscriptionCode: string;
  onCancel: () => void;
  onClickExtraInfo: () => void;
  handleClickCreateNewLogin: () => void;
  handleClickOnBuyDashlane: () => void;
  handleReplace: (item?: WebcardItem) => void;
}
export const SavePasswordFooter = ({
  isReplaceWebcardFormat,
  isLimited,
  isB2BDiscontinued,
  displayExtraInfo,
  emailOrLogin,
  formId,
  saveButtonRef,
  mainButtonLabel,
  accountSubscriptionCode,
  onCancel,
  onClickExtraInfo,
  handleClickCreateNewLogin,
  withExtraInfoButton,
  handleClickOnBuyDashlane,
}: Props) => {
  const { translate } = React.useContext(I18nContext);
  if (isReplaceWebcardFormat) {
    return isLimited ? (
      <Infobox
        title={translate(I18N_KEYS.PASSWORD_LIMITED_TITLE)}
        description={
          <a
            href={getPremiumPricingUrl(accountSubscriptionCode)}
            key={translate(I18N_KEYS.UPGRADE_TO_PREMIUM)}
            target="_blank"
            rel="noopener noreferrer"
          >
            {translate(I18N_KEYS.UPGRADE_TO_PREMIUM)}
          </a>
        }
        mood="warning"
        icon="PremiumOutlined"
      />
    ) : (
      <div
        className={classNames(styles.addNewLoginContainer, styles.active)}
        onClick={handleClickCreateNewLogin}
        onKeyUp={(e) => {
          if (
            e.key !== KEYBOARD_EVENTS.ENTER &&
            e.key !== KEYBOARD_EVENTS.SPACE
          ) {
            return;
          }
          handleClickCreateNewLogin();
        }}
        role="button"
        tabIndex={0}
        data-keyboard-accessible={translate(I18N_KEYS.CREATE_NEW_LOGIN)}
      >
        <div
          className={styles.addNewLoginIcon}
          sx={ITEMS_SX_STYLES.ICON_CONTAINER}
        >
          <Icon name="ActionAddOutlined" size="large" />
        </div>
        <div
          className={styles.addNewLoginTitle}
          sx={SX_STYLES.ADD_NEW_LOGIN_TITLE}
        >
          {translate(I18N_KEYS.CREATE_NEW_LOGIN)}
        </div>
      </div>
    );
  }
  return (
    <div className={styles.buttonsContainer}>
      {withExtraInfoButton ? (
        <div className={styles.moreButtonContainer}>
          <button
            className={styles.moreButton}
            sx={SX_STYLES.MORE_BUTTON}
            onClick={onClickExtraInfo}
            type="button"
            data-keyboard-accessible={translate(
              displayExtraInfo
                ? I18N_KEYS.CLOSE_MORE_OPTIONS
                : I18N_KEYS.OPEN_MORE_OPTIONS
            )}
          >
            <Icon
              name={displayExtraInfo ? "CaretUpOutlined" : "CaretDownOutlined"}
            />
            <span
              aria-hidden
              className={
                displayExtraInfo ? styles.moreOpened : styles.moreCollapsed
              }
            />
            {translate(
              displayExtraInfo
                ? I18N_KEYS.CLOSE_MORE_OPTIONS
                : I18N_KEYS.OPEN_MORE_OPTIONS
            )}
          </button>
        </div>
      ) : null}

      <SecondaryActionButton
        onClick={onCancel}
        label={
          isB2BDiscontinued
            ? translate(I18N_KEYS.DISMISS)
            : translate(I18N_KEYS.CANCEL)
        }
      />

      {isLimited ? (
        <PrimaryActionButton
          onClick={handleClickOnBuyDashlane}
          label={translate(I18N_KEYS.UPGRADE_TO_PREMIUM)}
          icon="PremiumOutlined"
        />
      ) : null}

      {isB2BDiscontinued ? (
        <PrimaryActionButton
          onClick={handleClickOnBuyDashlane}
          label={translate(I18N_KEYS.BUY_DASHLANE)}
        />
      ) : null}
      {!isLimited && !isB2BDiscontinued ? (
        <PrimarySubmitButton
          disabled={!emailOrLogin}
          form={formId}
          buttonRef={saveButtonRef}
          label={mainButtonLabel}
        />
      ) : null}
    </div>
  );
};
