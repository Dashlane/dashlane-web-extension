import * as React from "react";
import { Button, Flex, Infobox, jsx } from "@dashlane/design-system";
import { WebcardItem } from "@dashlane/autofill-engine/types";
import { KEYBOARD_EVENTS } from "../../../constants";
import { getPremiumPricingUrl } from "../../../utils/webApp/url";
import { I18nContext } from "../../../context/i18n";
import { SecondaryActionButton } from "../../common/generic/buttons/SecondaryActionButton";
import { PrimaryActionButton } from "../../common/generic/buttons/PrimaryActionButton";
import { PrimarySubmitButton } from "../../common/generic/buttons/PrimarySubmitButton";
const UTM_SOURCE_CODE =
  "button:buy_dashlane+click_origin:button+origin_page:autofill/notification/update_or_save_as_new+origin_component:webcard";
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
  INFOBOX_B2B_TRIAL_DISCONTINUED_TITLE: "infoboxTitleB2BTrialDiscontinued",
  INFOBOX_B2B_TRIAL_DISCONTINUED_DESCRIPTION:
    "infoboxDescriptionB2BTrialDiscontinued",
  PASSWORD_LIMITED_WARNING_REACHED_TITLE: "passwordLimitReachedTitle",
  PASSWORD_LIMITED_WARNING_REACHED_SUBTITLE: "passwordLimitReachedSubtitle",
  PASSWORD_LIMITED_WARNING_NEAR_LIMIT_TITLE: "passwordNearLimitTitle",
};
interface Props {
  isReplaceWebcardFormat: boolean;
  isLimited: boolean;
  isNearLimit: boolean;
  passwordsLeft?: number;
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
  handleClickUpgradeFromNearLimitWarning: () => void;
}
export const SavePasswordFooter = ({
  isReplaceWebcardFormat,
  isLimited,
  isNearLimit,
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
  passwordsLeft,
  handleClickUpgradeFromNearLimitWarning,
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
      <Button
        mood="neutral"
        intensity="supershy"
        layout="iconLeading"
        icon="ItemLoginOutlined"
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
        tabIndex={0}
        data-keyboard-accessible={translate(I18N_KEYS.CREATE_NEW_LOGIN)}
        fullsize
      >
        {translate(I18N_KEYS.CREATE_NEW_LOGIN)}
      </Button>
    );
  }
  return (
    <React.Fragment>
      {isNearLimit && passwordsLeft ? (
        <Infobox
          sx={{ marginBottom: "12px" }}
          title={translate(
            I18N_KEYS.PASSWORD_LIMITED_WARNING_NEAR_LIMIT_TITLE,
            {
              count: passwordsLeft,
            }
          )}
          description={
            <a
              href={getPremiumPricingUrl(
                accountSubscriptionCode,
                UTM_SOURCE_CODE
              )}
              key={translate(I18N_KEYS.UPGRADE_TO_PREMIUM)}
              target="_blank"
              rel="noopener noreferrer"
              onClick={handleClickUpgradeFromNearLimitWarning}
            >
              {translate(I18N_KEYS.UPGRADE_TO_PREMIUM)}
            </a>
          }
          mood="brand"
          icon="PremiumOutlined"
        />
      ) : null}
      {isLimited ? (
        <Infobox
          sx={{ marginBottom: "16px" }}
          title={translate(I18N_KEYS.PASSWORD_LIMITED_WARNING_REACHED_TITLE)}
          description={translate(
            I18N_KEYS.PASSWORD_LIMITED_WARNING_REACHED_SUBTITLE
          )}
          mood="danger"
          icon="PremiumOutlined"
        />
      ) : null}
      {isB2BDiscontinued ? (
        <Infobox
          sx={{ marginBottom: "16px" }}
          title={translate(I18N_KEYS.INFOBOX_B2B_TRIAL_DISCONTINUED_TITLE)}
          description={translate(
            I18N_KEYS.INFOBOX_B2B_TRIAL_DISCONTINUED_DESCRIPTION
          )}
          mood="danger"
        />
      ) : null}
      <Flex
        alignItems="center"
        justifyContent={withExtraInfoButton ? "space-between" : "flex-end"}
      >
        {withExtraInfoButton ? (
          <Button
            mood="neutral"
            intensity="supershy"
            size="small"
            type="button"
            icon={displayExtraInfo ? "CaretUpOutlined" : "CaretDownOutlined"}
            layout="iconLeading"
            onClick={onClickExtraInfo}
            data-keyboard-accessible={translate(
              displayExtraInfo
                ? I18N_KEYS.CLOSE_MORE_OPTIONS
                : I18N_KEYS.OPEN_MORE_OPTIONS
            )}
          >
            {translate(
              displayExtraInfo
                ? I18N_KEYS.CLOSE_MORE_OPTIONS
                : I18N_KEYS.OPEN_MORE_OPTIONS
            )}
          </Button>
        ) : null}

        <Flex gap="8px">
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
        </Flex>
      </Flex>
    </React.Fragment>
  );
};
