import * as React from "react";
import {
  AutofillButton,
  BrowseComponent,
  ClickOrigin,
  Button as HermesButton,
  PageView,
  UserAutofillClickEvent,
  UserClickEvent,
} from "@dashlane/hermes";
import {
  AutofillDropdownWebcardWarningType,
  GeneratePasswordWebcardData,
} from "@dashlane/autofill-engine/types";
import { useCommunication } from "../../../context/communication";
import { WebcardPropsBase } from "../config";
import { DropdownMessage } from "./common/DropdownMessage";
import { Button, Flex, Infobox, jsx } from "@dashlane/design-system";
import { useTranslate } from "../../../context/i18n";
import { getPremiumPricingUrl } from "../../../utils/webApp/url";
const UTM_SOURCE_CODE =
  "button:buy_dashlane+click_origin:button+origin_page:autofill/dropdown/password_generator+origin_component:webcard";
const uuidRegex = new RegExp("{[-a-zA-Z0-9]{36}}");
interface Props extends WebcardPropsBase {
  data: GeneratePasswordWebcardData;
  clickUseGeneratedPassword: (e: React.MouseEvent) => void;
  isB2BDiscontinued: boolean;
  subscriptionCode: string;
}
const I18N_KEYS = {
  BUTTON_BUY_DASHLANE: "buyDashlane",
  ROLE_BUTTON: "roleButton",
  USE_PASSWORD: "usePassword",
  PASSWORD_LIMITED_TITLE: "passwordLimitTitle",
  PASSWORD_LIMITED_SUBTITLE: "passwordLimitSubtitle",
  PASSWORD_LIMITED_WARNING_NEAR_LIMIT_TITLE: "passwordNearLimitTitle",
  UPGRADE_TO_PREMIUM: "upgradeToPremium",
};
export const GeneratePasswordFooter = ({
  data,
  closeWebcard,
  clickUseGeneratedPassword,
  isB2BDiscontinued,
  subscriptionCode,
}: Props) => {
  const { passwordLimitStatus, context: warningContext } = data;
  const { translate } = useTranslate();
  const { autofillEngineCommands } = useCommunication();
  const warningType =
    data.warningType ?? AutofillDropdownWebcardWarningType.None;
  React.useEffect(() => {
    autofillEngineCommands?.logPageView({
      pageView: PageView.AutofillDropdownSuggestion,
      browseComponent: BrowseComponent.Webcard,
    });
  }, [autofillEngineCommands]);
  const onSeeCredentialOnWebapp = async () => {
    autofillEngineCommands?.openWebapp({
      id: warningContext,
      route: "/passwords",
    });
    autofillEngineCommands?.logEvent(
      new UserAutofillClickEvent({
        autofillButton: AutofillButton.SeeAllPasswords,
      })
    );
    closeWebcard();
  };
  let showWarning = warningType !== AutofillDropdownWebcardWarningType.None;
  if (
    warningType ===
      AutofillDropdownWebcardWarningType.PossibleDuplicateRegistration &&
    !uuidRegex.test(warningContext || "")
  ) {
    showWarning = false;
  }
  const handleUpgradeToPremium = async () => {
    autofillEngineCommands?.logEvent(
      new UserClickEvent({
        clickOrigin: ClickOrigin.GeneratePasswordWebcardPasswordLimitReached,
        button: HermesButton.BuyDashlane,
      })
    );
    closeWebcard();
  };
  const handleClickUpgradeFromNearLimitWarning = () => {
    autofillEngineCommands?.logEvent(
      new UserClickEvent({
        clickOrigin:
          ClickOrigin.GeneratePasswordWebcardPasswordLimitCloseToBeReached,
        button: HermesButton.BuyDashlane,
      })
    );
    closeWebcard();
  };
  return (
    <div sx={{ paddingX: "8px", paddingBottom: "8px" }}>
      {showWarning ? (
        <DropdownMessage
          type={warningType}
          onSeeCredentialOnWebapp={onSeeCredentialOnWebapp}
        />
      ) : null}
      {passwordLimitStatus.shouldShowPasswordLimitReached ? (
        <Infobox
          title={translate(I18N_KEYS.PASSWORD_LIMITED_TITLE)}
          description={
            <a
              href={getPremiumPricingUrl(subscriptionCode, UTM_SOURCE_CODE)}
              key={translate(I18N_KEYS.PASSWORD_LIMITED_SUBTITLE)}
              target="_blank"
              rel="noopener noreferrer"
              onClick={handleUpgradeToPremium}
            >
              {translate(I18N_KEYS.PASSWORD_LIMITED_SUBTITLE)}
            </a>
          }
          mood="warning"
          icon="PremiumOutlined"
        />
      ) : null}
      {passwordLimitStatus.shouldShowNearPasswordLimit &&
      passwordLimitStatus.passwordsLeft ? (
        <Infobox
          sx={{ marginBottom: "12px" }}
          title={translate(
            I18N_KEYS.PASSWORD_LIMITED_WARNING_NEAR_LIMIT_TITLE,
            {
              count: passwordLimitStatus.passwordsLeft,
            }
          )}
          description={
            <a
              href={getPremiumPricingUrl(subscriptionCode, UTM_SOURCE_CODE)}
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
      <Button
        mood="brand"
        intensity="catchy"
        size="small"
        type="button"
        onClick={clickUseGeneratedPassword}
        data-keyboard-accessible={`${translate(I18N_KEYS.USE_PASSWORD)}:
               ${translate(I18N_KEYS.ROLE_BUTTON)}`}
        fullsize
      >
        {isB2BDiscontinued
          ? translate(I18N_KEYS.BUTTON_BUY_DASHLANE)
          : translate(I18N_KEYS.USE_PASSWORD)}
      </Button>
    </div>
  );
};
