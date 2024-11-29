import { useContext, useEffect, useMemo, useRef, useState } from "react";
import {
  Button,
  Icon,
  jsx,
  PasswordDisplayField,
  PasswordStrength,
} from "@dashlane/design-system";
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
} from "@dashlane/autofill-engine/types";
import { OtherSourceType } from "@dashlane/autofill-contracts";
import { useTranslate } from "../../../context/i18n";
import { usePerformanceContext } from "../../../context/performance";
import { FeatureFlipContext } from "../../../context/featureFlip";
import { useCommunication } from "../../../context/communication";
import { usePasswordShuffler } from "../../../utils/passwordShuffler/usePasswordShuffler";
import { getZxcvbnScoreFrom100BaseStrength } from "../../../utils/passwordStrength";
import { redirectToBuyDashlaneB2B } from "../../../utils/webApp/url";
import { useWebcardVisibilityChecker } from "../../common/hooks/visibilityChecker";
import { DropdownContainer } from "../../common/layout/DropdownContainer";
import { HeaderTitle } from "../../common/layout/HeaderTitle";
import { WebcardPropsBase } from "../config";
import { GeneratorSettings } from "./GeneratorSettings/GeneratorSettings";
import { GeneratePasswordFooter } from "./GeneratePasswordFooter";
const BACKGROUND_COLOR = "ds.container.expressive.neutral.quiet.disabled";
const I18N_KEYS = {
  BUTTON_RESHUFFLE_PASSWORD: "generatePasswordButtons_reshuffle",
  BUTTON_SHOW_PASSWORD: "generatePasswordButtons_showPassword",
  BUTTON_HIDE_PASSWORD: "generatePasswordButtons_hidePassword",
  BUTTON_SHOW_SETTINGS: "generatePasswordButtons_openSettings",
  BUTTON_CLOSE_SETTINGS: "generatePasswordButtons_closeSettings",
  ROLE_BUTTON: "roleButton",
  TITLE: "generatePasswordDropdownTitle",
  PASSWORD_STRENGTH: {
    TOO_GUESSABLE: "generatePasswordStrength_tooGuessable",
    VERY_GUESSABLE: "generatePasswordStrength_veryGuessable",
    SOMEWHAT_GUESSABLE: "generatePasswordStrength_somewhatGuessable",
    SAFELY_UNGUESSABLE: "generatePasswordStrength_safelyUnguessable",
    VERY_UNGUESSABLE: "generatePasswordStrength_veryUnguessable",
    NONE: "generatePasswordStrength_none",
  },
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
    showAccountFrozenStatus,
  } = data;
  const { translate } = useTranslate();
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
  const revealPasswordDebounce = useRef<NodeJS.Timeout>();
  useEffect(
    () => () =>
      revealPasswordDebounce.current &&
      clearTimeout(revealPasswordDebounce.current),
    []
  );
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
  const onClickRevealPassword = (isVisible: boolean) => {
    if (revealPasswordDebounce.current) {
      clearTimeout(revealPasswordDebounce.current);
    }
    revealPasswordDebounce.current = setTimeout(() => {
      setShowPassword(isVisible);
      autofillEngineCommands?.logEvent(
        new UserAutofillClickEvent({
          autofillButton: AutofillButton.Reveal,
        })
      );
    }, 200);
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
    const nextValue = !showGenerationOptions;
    setShowGenerationOptions(nextValue);
    onClickRevealPassword(nextValue);
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
  const zxcvbnScore = useMemo(
    () => getZxcvbnScoreFrom100BaseStrength(passwordStrength),
    [passwordStrength]
  );
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
  const footerContent = (
    <GeneratePasswordFooter
      data={data}
      closeWebcard={closeWebcard}
      clickUseGeneratedPassword={handleClickOnMainButton}
      isB2BDiscontinued={isB2BDiscontinued}
      subscriptionCode={subscriptionCode}
    />
  );
  const passwordFieldActions = () => {
    const actions = [];
    if (showPassword) {
      actions.push(
        <Button
          key="refresh-button"
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
      );
    }
    if (options) {
      actions.push(
        <Button
          key="options-button"
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
      );
    }
    return actions;
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
      <div sx={{ paddingX: "16px" }}>
        <PasswordDisplayField
          id="passwordGeneratorText"
          label=""
          toggleVisibilityLabel={{
            show: translate(I18N_KEYS.BUTTON_SHOW_PASSWORD),
            hide: translate(I18N_KEYS.BUTTON_HIDE_PASSWORD),
          }}
          onValueVisibilityChange={onClickRevealPassword}
          value={password}
          actions={passwordFieldActions()}
        />

        {showGenerationOptions && options && (
          <div sx={{ marginTop: "16px" }}>
            <PasswordStrength
              descriptionId="password-strength"
              description={{
                NoScore: translate(I18N_KEYS.PASSWORD_STRENGTH.NONE),
                TooGuessable: translate(
                  I18N_KEYS.PASSWORD_STRENGTH.TOO_GUESSABLE
                ),
                VeryGuessable: translate(
                  I18N_KEYS.PASSWORD_STRENGTH.VERY_GUESSABLE
                ),
                SomewhatGuessable: translate(
                  I18N_KEYS.PASSWORD_STRENGTH.SOMEWHAT_GUESSABLE
                ),
                SafelyUnGuessable: translate(
                  I18N_KEYS.PASSWORD_STRENGTH.SAFELY_UNGUESSABLE
                ),
                VeryUnGuessable: translate(
                  I18N_KEYS.PASSWORD_STRENGTH.VERY_UNGUESSABLE
                ),
              }}
              score={zxcvbnScore}
              isPride={featuresList.hasFeature("webplatform_web_prideColors")}
            />
            <GeneratorSettings
              options={options}
              backgroundColorToken={BACKGROUND_COLOR}
              handleSettingsChange={handleSettingsChange}
              autofillEngineCommands={autofillEngineCommands}
            />
          </div>
        )}
      </div>
    </DropdownContainer>
  );
};
