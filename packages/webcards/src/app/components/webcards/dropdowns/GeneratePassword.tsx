import { useContext, useEffect, useMemo, useState } from "react";
import { PasswordStrength } from "@dashlane/ui-components";
import { Button, Icon, Infobox, jsx } from "@dashlane/design-system";
import {
  AnonymousAutofillAcceptEvent,
  AnonymousAutofillSuggestEvent,
  AutofillButton,
  BrowseComponent,
  ClickOrigin,
  DomainType,
  hashDomain,
  Button as HermesButton,
  ItemType,
  PageView,
  UserAutofillAcceptEvent,
  UserAutofillClickEvent,
  UserAutofillSuggestEvent,
  UserClickEvent,
  UserGeneratePasswordEvent,
} from "@dashlane/hermes";
import {
  AutofillDropdownWebcardPasswordGenerationSettings,
  AutofillRequestOriginType,
  GeneratePasswordWebcardData,
} from "@dashlane/autofill-engine/dist/autofill-engine/src/types";
import { OtherSourceType } from "@dashlane/autofill-contracts";
import { I18nContext } from "../../../context/i18n";
import { usePerformanceContext } from "../../../context/performance";
import { FeatureFlipContext } from "../../../context/featureFlip";
import { useCommunication } from "../../../context/communication";
import { usePasswordShuffler } from "../../../utils/passwordShuffler/usePasswordShuffler";
import {
  getStrengthI18nKey,
  getZxcvbnScoreFrom100BaseStrength,
} from "../../../utils/passwordStrength";
import {
  getPremiumPricingUrl,
  redirectToBuyDashlaneB2B,
} from "../../../utils/webApp/url";
import { useWebcardVisibilityChecker } from "../../common/hooks/visibilityChecker";
import { DropdownContainer } from "../../common/layout/DropdownContainer";
import { HeaderTitle } from "../../common/layout/HeaderTitle";
import { WebcardPropsBase } from "../config";
import { GeneratorSettings } from "./GeneratorSettings/GeneratorSettings";
import ColorfulPassword from "./GeneratorSettings/ColorfulPassword";
import { GeneratePasswordFooter } from "./GeneratePasswordFooter";
import styles from "./GeneratePassword.module.scss";
const PASSWORD_HIDDEN_SYMBOL = "\u2022";
const BACKGROUND_COLOR = "ds.container.expressive.neutral.quiet.disabled";
const UTM_SOURCE_CODE =
  "button:buy_dashlane+click_origin:button+origin_page:autofill/dropdown/password_generator+origin_component:webcard";
const SX_STYLES = {
  PASSWORD_TEXT: {
    color: "ds.text.neutral.catchy",
    transition: "opacity 0.1s ease",
    marginTop: "10px",
  },
};
const I18N_KEYS = {
  BUTTON_RESHUFFLE_PASSWORD: "generatePasswordButtons_reshuffle",
  BUTTON_SHOW_PASSWORD: "generatePasswordButtons_showPassword",
  BUTTON_HIDE_PASSWORD: "generatePasswordButtons_hidePassword",
  BUTTON_SHOW_SETTINGS: "generatePasswordButtons_openSettings",
  BUTTON_CLOSE_SETTINGS: "generatePasswordButtons_closeSettings",
  BUTTON_BUY_DASHLANE: "buyDashlane",
  ROLE_BUTTON: "roleButton",
  TITLE: "generatePasswordDropdownTitle",
  USE_PASSWORD: "usePassword",
  PASSWORD_LIMITED_TITLE: "passwordLimitTitle",
  PASSWORD_LIMITED_SUBTITLE: "passwordLimitSubtitle",
  PASSWORD_LIMITED_WARNING_NEAR_LIMIT_TITLE: "passwordNearLimitTitle",
  UPGRADE_TO_PREMIUM: "upgradeToPremium",
  INFOBOX_B2B_TRIAL_DISCONTINUED_TITLE: "infoboxTitleB2BTrialDiscontinued",
  INFOBOX_B2B_TRIAL_DISCONTINUED_DESCRIPTION:
    "infoboxDescriptionB2BTrialDiscontinued",
};
interface Props extends WebcardPropsBase {
  data: GeneratePasswordWebcardData;
}
export const GeneratePassword = ({ data, closeWebcard }: Props) => {
  const {
    formType,
    webcardType,
    passwordGenerationSettings,
    srcElement,
    tabRootDomain,
    webcardId,
    autofillRecipes,
    passwordLimitStatus,
    showAccountFrozenStatus,
  } = data;
  const { translate } = useContext(I18nContext);
  const featuresList = useContext(FeatureFlipContext);
  const timeToWebcard = usePerformanceContext();
  const {
    autofillEngineCommands,
    autofillEngineDispatcher,
    setAutofillEngineActionsHandlers,
  } = useCommunication();
  const checkWebcardVisible = useWebcardVisibilityChecker({
    webcardId,
    autofillEngineDispatcher,
    closeWebcard,
  });
  const { isB2BDiscontinued } = showAccountFrozenStatus;
  const [generatedPassword, setGeneratedPassword] = useState("");
  const [subscriptionCode, setSubscriptionCode] = useState("");
  const [passwordStrength, setPasswordStrength] = useState(-1);
  const [showPassword, setShowPassword] = useState(false);
  const [showGenerationOptions, setShowGenerationOptions] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [options, setNewOptions] = useState(passwordGenerationSettings);
  useEffect(() => {
    autofillEngineCommands?.logPageView({
      pageView: PageView.AutofillDropdownPasswordGenerator,
      browseComponent: BrowseComponent.Webcard,
    });
    autofillEngineCommands?.generateNewPassword(passwordGenerationSettings);
  }, [autofillEngineCommands, passwordGenerationSettings]);
  useEffect(() => {
    if (timeToWebcard) {
      autofillEngineCommands?.logEvent(
        new UserAutofillSuggestEvent({
          isNativeApp: false,
          vaultTypeList: [ItemType.GeneratedPassword],
          msToWebcard: timeToWebcard,
        })
      );
      (async () => {
        autofillEngineCommands?.logEvent(
          new AnonymousAutofillSuggestEvent({
            domain: {
              type: DomainType.Web,
              id: await hashDomain(tabRootDomain ?? ""),
            },
            isNativeApp: false,
            vaultTypeList: [ItemType.GeneratedPassword],
            msToWebcard: timeToWebcard,
          })
        );
      })();
    }
  }, [autofillEngineCommands, tabRootDomain, timeToWebcard]);
  useEffect(() => {
    setAutofillEngineActionsHandlers?.({
      updateNewPassword: (newPassword: string, newStrength: number) => {
        setGeneratedPassword(newPassword);
        setPasswordStrength(newStrength);
        autofillEngineCommands?.logEvent(
          new UserGeneratePasswordEvent({
            hasDigits: options.digits,
            hasLetters: options.letters,
            hasSimilar: !options.avoidAmbiguous,
            hasSymbols: options.symbols,
            length: options.length,
          })
        );
      },
      updateUserSubscriptionCode: (userSubscriptionCode) => {
        setSubscriptionCode(userSubscriptionCode);
      },
    });
  });
  const { shuffledPassword, isPasswordShuffling } = usePasswordShuffler({
    shouldShuffle: isLoading,
    passwordLength: generatedPassword?.length || 0,
  });
  const password = isPasswordShuffling ? shuffledPassword : generatedPassword;
  useEffect(() => {
    setIsLoading(false);
  }, [generatedPassword]);
  const onClickRevealPassword = () => {
    setShowPassword((prevState) => !prevState);
    autofillEngineCommands?.logEvent(
      new UserAutofillClickEvent({
        autofillButton: AutofillButton.Reveal,
      })
    );
  };
  const onClickRefreshPassword = () => {
    autofillEngineCommands?.generateNewPassword(options);
    autofillEngineCommands?.logEvent(
      new UserAutofillClickEvent({
        autofillButton: AutofillButton.Shuffle,
      })
    );
    setIsLoading(true);
  };
  const onClickSeeOptions = () => {
    setShowGenerationOptions((prevState) => !prevState);
    setShowPassword(() => !showGenerationOptions);
  };
  const handleSettingsChange = (
    newOptions: AutofillDropdownWebcardPasswordGenerationSettings
  ) => {
    setNewOptions(newOptions);
    autofillEngineCommands?.generateNewPassword(newOptions);
    autofillEngineCommands?.logEvent(
      new UserAutofillClickEvent({
        autofillButton: AutofillButton.Shuffle,
      })
    );
    setIsLoading(true);
  };
  const onClickUsePassword = async () => {
    const isSetAsDefault =
      JSON.stringify(options) === JSON.stringify(passwordGenerationSettings);
    autofillEngineCommands?.logEvent(
      new UserAutofillAcceptEvent({
        dataTypeList: [ItemType.GeneratedPassword],
        isSetAsDefault,
      })
    );
    autofillEngineCommands?.logEvent(
      new AnonymousAutofillAcceptEvent({
        domain: {
          type: DomainType.Web,
          id: await hashDomain(tabRootDomain ?? ""),
        },
        isSetAsDefault,
      })
    );
    const autofillRecipe = autofillRecipes[OtherSourceType.NewPassword];
    if (autofillRecipe && (await checkWebcardVisible())) {
      autofillEngineCommands?.applyAutofillRecipe({
        autofillRecipe,
        dataSource: {
          type: OtherSourceType.NewPassword,
          value: generatedPassword,
        },
        focusedElement: {
          elementId: srcElement.elementId,
          frameId: srcElement.frameId,
        },
        formClassification: formType,
        requestOrigin: {
          type: AutofillRequestOriginType.Webcard,
          webcardType,
        },
      });
    }
    closeWebcard();
  };
  const strengthKey = useMemo(
    () => getStrengthI18nKey(passwordStrength),
    [passwordStrength]
  );
  const zxcvbnScore = useMemo(
    () => getZxcvbnScoreFrom100BaseStrength(passwordStrength),
    [passwordStrength]
  );
  const footerContent = (
    <GeneratePasswordFooter data={data} closeWebcard={closeWebcard} />
  );
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
  const handleClickOnMainButton = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isB2BDiscontinued) {
      autofillEngineCommands?.logEvent(
        new UserClickEvent({
          clickOrigin: ClickOrigin.GeneratePasswordWebcardB2bTrialEndReached,
          button: HermesButton.BuyDashlane,
        })
      );
      closeWebcard();
      autofillEngineCommands &&
        setAutofillEngineActionsHandlers &&
        redirectToBuyDashlaneB2B(
          autofillEngineCommands,
          setAutofillEngineActionsHandlers
        );
    } else {
      onClickUsePassword();
    }
  };
  return (
    <DropdownContainer
      closeWebcard={closeWebcard}
      footerContent={footerContent}
      headerContent={<HeaderTitle title={translate(I18N_KEYS.TITLE)} />}
      webcardData={data}
      withHeaderLogo
      withHeaderOptionsButton
      withHeaderSearchButton
      withFooterPadding={false}
    >
      <div className={styles.newMain}>
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
        {isB2BDiscontinued ? (
          <Infobox
            sx={{ marginBottom: "8px" }}
            title={translate(I18N_KEYS.INFOBOX_B2B_TRIAL_DISCONTINUED_TITLE)}
            description={translate(
              I18N_KEYS.INFOBOX_B2B_TRIAL_DISCONTINUED_DESCRIPTION
            )}
            mood="warning"
            icon="FeedbackFailOutlined"
          />
        ) : null}
        <div className={styles.password}>
          <div
            id="passwordGeneratorText"
            className={styles.passwordText}
            sx={SX_STYLES.PASSWORD_TEXT}
          >
            {password &&
              (showPassword ? (
                <ColorfulPassword password={password} />
              ) : (
                PASSWORD_HIDDEN_SYMBOL.repeat(password.length || 0)
              ))}
          </div>
          <div id="passwordGeneratorMenu" className={styles.buttonMenu}>
            {showPassword ? (
              <Button
                disabled={isB2BDiscontinued}
                mood="neutral"
                intensity="supershy"
                id="refreshButton"
                type="button"
                size="small"
                onClick={(e) => {
                  e.stopPropagation();
                  onClickRefreshPassword();
                }}
                layout="iconOnly"
                icon={<Icon name="ActionRefreshOutlined" />}
                data-keyboard-accessible={`${translate(
                  I18N_KEYS.BUTTON_RESHUFFLE_PASSWORD
                )}:
                   ${translate(I18N_KEYS.ROLE_BUTTON)}`}
              />
            ) : null}
            <Button
              disabled={isB2BDiscontinued}
              mood="neutral"
              intensity="supershy"
              id="showPassword"
              onClick={(e) => {
                e.stopPropagation();
                onClickRevealPassword();
              }}
              type="button"
              size="small"
              layout="iconOnly"
              icon={
                showPassword ? (
                  <Icon name="ActionHideOutlined" />
                ) : (
                  <Icon name="ActionRevealOutlined" />
                )
              }
              data-keyboard-accessible={
                showPassword
                  ? `${translate(I18N_KEYS.BUTTON_HIDE_PASSWORD)}:
                     ${translate(I18N_KEYS.ROLE_BUTTON)}`
                  : `${translate(I18N_KEYS.BUTTON_SHOW_PASSWORD)}:
                     ${translate(I18N_KEYS.ROLE_BUTTON)}`
              }
            />
            {options && (
              <Button
                disabled={isB2BDiscontinued}
                mood="neutral"
                intensity="supershy"
                id="settingsButton"
                type="button"
                size="small"
                onClick={(e) => {
                  e.stopPropagation();
                  onClickSeeOptions();
                }}
                layout="iconOnly"
                icon={<Icon name="ConfigureOutlined" />}
                data-keyboard-accessible={
                  showGenerationOptions
                    ? `${translate(I18N_KEYS.BUTTON_CLOSE_SETTINGS)}:
                       ${translate(I18N_KEYS.ROLE_BUTTON)}`
                    : `${translate(I18N_KEYS.BUTTON_SHOW_SETTINGS)}:
                       ${translate(I18N_KEYS.ROLE_BUTTON)}`
                }
              />
            )}
          </div>
        </div>

        {showGenerationOptions && options && (
          <div className={styles.expandedView}>
            <PasswordStrength
              elementId="password-strength"
              score={zxcvbnScore}
              showAdditionalText={true}
              additionalText={translate(strengthKey)}
              backgroundColor={BACKGROUND_COLOR}
              showQueerColors={featuresList.hasFeature(
                "webplatform_web_prideColors"
              )}
            />
            <GeneratorSettings
              options={options}
              backgroundColorToken={BACKGROUND_COLOR}
              handleSettingsChange={handleSettingsChange}
              autofillEngineCommands={autofillEngineCommands}
            />
          </div>
        )}

        <div className={styles.mainButtonContainer}>
          <Button
            mood="brand"
            intensity="catchy"
            size="small"
            type="button"
            onClick={handleClickOnMainButton}
            className={styles.mainButton}
            data-keyboard-accessible={`${translate(I18N_KEYS.USE_PASSWORD)}:
               ${translate(I18N_KEYS.ROLE_BUTTON)}`}
          >
            {isB2BDiscontinued
              ? translate(I18N_KEYS.BUTTON_BUY_DASHLANE)
              : translate(I18N_KEYS.USE_PASSWORD)}
          </Button>
        </div>
      </div>
    </DropdownContainer>
  );
};
