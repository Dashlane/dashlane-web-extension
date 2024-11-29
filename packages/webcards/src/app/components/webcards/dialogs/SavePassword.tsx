import * as React from "react";
import {
  Button,
  Checkbox,
  ExpressiveIcon,
  Flex,
  ItemHeader,
  jsx,
  Logo,
  PasswordField,
} from "@dashlane/design-system";
import { VaultSourceType } from "@dashlane/autofill-contracts";
import {
  SavePasswordWebcardData,
  vaultSourceTypeToHermesItemTypeMap,
  WebcardCollectionData,
  WebcardItem,
} from "@dashlane/autofill-engine/types";
import {
  AnonymousAutofillAcceptEvent,
  AnonymousAutofillDismissEvent,
  AnonymousAutofillSuggestEvent,
  AutofillButton,
  BrowseComponent,
  CallToAction,
  ClickOrigin,
  DismissType,
  DomainType,
  hashDomain,
  Button as HermesButton,
  ItemType,
  PageView,
  UserAutofillAcceptEvent,
  UserAutofillClickEvent,
  UserAutofillDismissEvent,
  UserAutofillSuggestEvent,
  UserCallToActionEvent,
  UserClickEvent,
  WebcardSaveOptions,
} from "@dashlane/hermes";
import { I18nContext } from "../../../context/i18n";
import { useCommunication } from "../../../context/communication";
import { usePerformanceContext } from "../../../context/performance";
import { KEYBOARD_EVENTS } from "../../../constants";
import {
  redirectToBuyDashlaneB2B,
  redirectToGetPremiumPage,
} from "../../../utils/webApp/url";
import { DialogContainer } from "../../common/layout/DialogContainer";
import { HeaderTitle } from "../../common/layout/HeaderTitle";
import { useWebcardVisibilityChecker } from "../../common/hooks/visibilityChecker";
import { Combobox, OptionProps } from "../../common/generic/Combobox";
import { useSpaceInfosPatcher } from "../../common/generic/Space";
import { SuggestedItemsList } from "../dropdowns/SuggestedItemsList";
import { WebcardPropsBase } from "../config";
import { SavePasswordFooter } from "./SavePasswordFooter";
import { Header } from "../../common/layout/Header";
const FORM_ID = "save-password-form";
const SAVE_PWD_COMBOBOX_ID = "savePassword-combobox-email";
const SAVE_PWD_COMBOBOX_COLLECTION_ID = "savePassword-combobox-collection";
const SAVE_PWD_READONLY_ID = "savePassword-password-readonly";
const SAVE_PWD_COMBOBOX_SPACE_ID = "savePassword-combobox-spaces";
const SAVE_PWD_PROTECTED_OPT_LABEL_ID = "savePassword-checkProtectedOpt-label";
const SAVE_PWD_SUBDOMAIN_OPT_LABEL_ID = "savePassword-checkSubdomainOpt-label";
const I18N_KEYS = {
  BUTTON_HIDE_PASSWORD: "passwordHideButton",
  BUTTON_SHOW_PASSWORD: "passwordShowButton",
  BUTTON_SAVE: "save",
  HEADER_TITLE_UPDATE_OR_CREATE_NEW: "updatePasswordOrCreateNewLogin",
  HEADER_TITLE_UPDATE_OR_CREATE_NEW_LIMIT:
    "updatePasswordOrCreateNewLoginLimit",
  HEADER_TITLE_NOHTML: "header_nohtml",
  HEADER_TITLE_B2B_TRIAL_DISCONTINUED: "headerTitleB2BTrialDiscontinued",
  LABEL_LOGIN_FIELD: "loginFieldLabel",
  LABEL_PASSWORD_FIELD: "passwordFieldLabel",
  OPTION_ALWAYS_USE_MP: "alwaysUseMasterPwd",
  OPTION_ONLY_ON_SUBDOMAIN: "useOnlyOnSubdomain",
  PLACEHOLDER_LOGIN: "selectEmailOrUsernamePlaceholder",
  UPGRADE_TO_PREMIUM: "upgradeToPremium",
  INFOBOX_B2B_TRIAL_DISCONTINUED_TITLE: "infoboxTitleB2BTrialDiscontinued",
  INFOBOX_B2B_TRIAL_DISCONTINUED_DESCRIPTION:
    "infoboxDescriptionB2BTrialDiscontinued",
  SAVE_WEBCARD_ADD_COLLECTION_SELECT_LABEL: "selectCollectionPlaceholder",
};
const SX_STYLES = {
  DOMAIN: {
    fontSize: "10px",
    textTransform: "uppercase" as const,
    color: "ds.text.brand.standard.quiet",
    letterSpacing: "0.2px",
    lineHeight: "100%",
    fontWeight: "500",
  },
};
interface Props extends WebcardPropsBase {
  data: SavePasswordWebcardData;
}
export const SavePassword = ({ data, closeWebcard }: Props) => {
  const getSpaceInfos = useSpaceInfosPatcher();
  const spaces = data.spaces.map(getSpaceInfos);
  const { translate } = React.useContext(I18nContext);
  const {
    autofillEngineCommands,
    autofillEngineDispatcher,
    setAutofillEngineActionsHandlers,
  } = useCommunication();
  const timeToWebcard = usePerformanceContext();
  const checkWebcardVisible = useWebcardVisibilityChecker({
    webcardId: data.webcardId,
    autofillEngineDispatcher,
    closeWebcard,
  });
  const [checkProtectedOpt, setCheckProtectedOpt] = React.useState(false);
  const [checkSubdomainOpt, setCheckSubdomainOpt] = React.useState(false);
  const [defaultSpace, setDefaultSpace] = React.useState("");
  const [displayExtraInfo, setDisplayExtraInfo] = React.useState(false);
  const [isInputErrored, setIsInputErrored] = React.useState(false);
  const [isProtected, setIsProtected] = React.useState(false);
  const [hasBackButton, setHasBackButton] = React.useState(false);
  const [existingCredentialId, setExistingCredentialId] = React.useState("");
  const [subscriptionCode, setSubscriptionCode] = React.useState("");
  const [stateData, setStateData] = React.useState(data);
  const {
    webcardId,
    domain,
    capturedUsernames,
    fullDomain,
    url,
    emailOrLogin,
    existingCredentialsForDomain,
    dropdownLoginOptions,
    space: selectedSpaceId,
    showSpacesList,
    showSubdomainOpt,
    passwordToSave,
    allowMasterPasswordProtection,
    isRestoredWebcard,
    passwordLimitStatus,
    showAccountFrozenStatus,
  } = stateData;
  const collections =
    data.collections?.filter(
      (collection) => collection.spaceId === selectedSpaceId
    ) ?? [];
  const [selectedCollection, setSelectedCollection] = React.useState<
    WebcardCollectionData | undefined
  >(undefined);
  const { showCollectionList } = data;
  const saveButton = React.useRef<HTMLButtonElement>(null);
  const { isB2BDiscontinued } = showAccountFrozenStatus;
  const [isReplaceWebcardFormat, setIsReplaceWebcardFormat] = React.useState(
    !isB2BDiscontinued &&
      ((!capturedUsernames.email &&
        !capturedUsernames.login &&
        !capturedUsernames.secondaryLogin &&
        existingCredentialsForDomain.length > 0) ||
        existingCredentialsForDomain.length > 0)
  );
  const getPageView = () => {
    if (isB2BDiscontinued) {
      return PageView.AutofillNotificationB2bTrialEndReached;
    }
    if (passwordLimitStatus.shouldShowPasswordLimitReached) {
      return PageView.AutofillNotificationFreeUserPasswordLimitReached;
    }
    return isReplaceWebcardFormat
      ? PageView.AutofillNotificationUpdateOrSaveAsNew
      : PageView.AutofillNotificationSave;
  };
  React.useEffect(() => {
    autofillEngineCommands?.logPageView({
      pageView: getPageView(),
      browseComponent: BrowseComponent.Webcard,
    });
    if (emailOrLogin) {
      saveButton.current?.focus();
    }
  }, [autofillEngineCommands]);
  React.useEffect(() => {
    if (timeToWebcard) {
      const webcardSaveOptions: WebcardSaveOptions[] = isReplaceWebcardFormat
        ? [WebcardSaveOptions.SaveAsNew, WebcardSaveOptions.Replace]
        : [WebcardSaveOptions.Save];
      const webcardItemTotalCount = isReplaceWebcardFormat
        ? existingCredentialsForDomain.length
        : undefined;
      autofillEngineCommands?.logEvent(
        new UserAutofillSuggestEvent({
          webcardSaveOptions,
          isNativeApp: false,
          isLoginPrefilled: emailOrLogin ? true : false,
          vaultTypeList: [ItemType.Credential],
          msToWebcard: timeToWebcard,
          webcardItemTotalCount,
          isRestoredWebcard,
        })
      );
      (async () => {
        autofillEngineCommands?.logEvent(
          new AnonymousAutofillSuggestEvent({
            domain: {
              id: await hashDomain(domain ?? ""),
              type: DomainType.Web,
            },
            webcardSaveOptions,
            isNativeApp: false,
            isLoginPrefilled: emailOrLogin ? true : false,
            vaultTypeList: [ItemType.Credential],
            msToWebcard: timeToWebcard,
            webcardItemTotalCount,
          })
        );
      })();
    }
  }, [timeToWebcard, isReplaceWebcardFormat, autofillEngineCommands]);
  React.useEffect(() => {
    if (!isReplaceWebcardFormat) {
      saveButton.current?.focus();
    }
  }, [isReplaceWebcardFormat]);
  const updateStateData = (newData: Partial<SavePasswordWebcardData>) => {
    setStateData((currentStateData: SavePasswordWebcardData) => ({
      ...currentStateData,
      ...newData,
    }));
  };
  React.useEffect(() => {
    setStateData((currentStateData: SavePasswordWebcardData) => {
      if (data.emailOrLogin === currentStateData.emailOrLogin) {
        return {
          ...currentStateData,
          ...data,
        };
      } else {
        return currentStateData;
      }
    });
  }, [data]);
  React.useEffect(() => {
    setAutofillEngineActionsHandlers?.({
      updateSavePasswordTargetCredential: (spaceInfo, credentialInfo) => {
        if (credentialInfo) {
          setExistingCredentialId(credentialInfo.id);
          setCheckSubdomainOpt(credentialInfo.onlyForThisSubdomain);
          setStateData((currentStateData: SavePasswordWebcardData) => {
            return {
              ...currentStateData,
              space: spaceInfo.space,
              showSpacesList: spaceInfo.showSpacesList,
            };
          });
          setIsProtected(credentialInfo.isProtected);
        } else {
          setExistingCredentialId("");
          setCheckSubdomainOpt(false);
          setStateData((currentStateData: SavePasswordWebcardData) => ({
            ...currentStateData,
            space: spaceInfo.space,
            showSpacesList: spaceInfo.showSpacesList,
          }));
          setIsProtected(false);
        }
        setDefaultSpace(spaceInfo.space);
      },
      updateSavePasswordCapturedData: (
        actionWebcardId,
        updatedPasswordToSave,
        updatedEmailOrLogin,
        updatedCapturedUsernames
      ) => {
        if (actionWebcardId === webcardId) {
          setStateData((currentStateData: SavePasswordWebcardData) => {
            if (currentStateData.emailOrLogin !== updatedEmailOrLogin) {
              autofillEngineCommands?.findSavePasswordTargetCredential(
                updatedEmailOrLogin,
                currentStateData.url
              );
              setIsInputErrored(false);
            }
            return {
              ...currentStateData,
              passwordToSave: updatedPasswordToSave,
              emailOrLogin: updatedEmailOrLogin,
              capturedUsernames: updatedCapturedUsernames,
            };
          });
        }
      },
      updateUserSubscriptionCode: (userSubscriptionCode: string) => {
        setSubscriptionCode(userSubscriptionCode);
      },
    });
  }, [autofillEngineCommands, setAutofillEngineActionsHandlers, webcardId]);
  React.useEffect(() => {
    autofillEngineCommands?.findSavePasswordTargetCredential(emailOrLogin, url);
  }, [autofillEngineCommands, emailOrLogin, url]);
  const logAcceptEvent = (
    optionSelected: WebcardSaveOptions,
    itemPosition?: number
  ) => {
    const spaceChanged = stateData.space !== defaultSpace;
    const itemType =
      vaultSourceTypeToHermesItemTypeMap[VaultSourceType.Credential];
    autofillEngineCommands?.logEvent(
      new UserAutofillAcceptEvent({
        dataTypeList: itemType ? [itemType] : [],
        isSetAsDefault:
          !checkProtectedOpt && !checkSubdomainOpt && !spaceChanged,
        isProtected: isProtected || checkProtectedOpt,
        webcardOptionSelected: optionSelected,
        itemPosition,
      })
    );
    (async () => {
      autofillEngineCommands?.logEvent(
        new AnonymousAutofillAcceptEvent({
          domain: {
            type: DomainType.Web,
            id: await hashDomain(domain),
          },
          isSetAsDefault:
            !checkProtectedOpt && !checkSubdomainOpt && !spaceChanged,
          isProtected: isProtected || checkProtectedOpt,
          webcardOptionSelected: optionSelected,
        })
      );
    })();
  };
  const onEmailChange = ({ value }: OptionProps) => {
    updateStateData({ emailOrLogin: value });
    setIsInputErrored(false);
  };
  const onSpaceChange = ({ key }: OptionProps) => {
    if (typeof key === "string") {
      updateStateData({ space: key });
    }
  };
  const onCollectionChange = ({ key }: OptionProps) => {
    if (typeof key === "string") {
      setSelectedCollection(
        collections.find((collection) => collection.id === key)
      );
    }
  };
  const onClose = async ({ withEscapeKey = false } = {}) => {
    passwordLimitStatus.shouldShowPasswordLimitReached
      ? autofillEngineCommands?.logEvent(
          new UserCallToActionEvent({
            callToActionList: [CallToAction.BuyDashlane, CallToAction.Dismiss],
            chosenAction: CallToAction.Dismiss,
            hasChosenNoAction: false,
          })
        )
      : autofillEngineCommands?.logEvent(
          new UserAutofillDismissEvent({
            dismissType: withEscapeKey
              ? DismissType.CloseEscape
              : DismissType.CloseCross,
          })
        );
    autofillEngineCommands?.logEvent(
      new AnonymousAutofillDismissEvent({
        domain: {
          type: DomainType.Web,
          id: await hashDomain(domain ?? ""),
        },
        isNativeApp: false,
        dismissType: withEscapeKey
          ? DismissType.CloseEscape
          : DismissType.CloseCross,
      })
    );
    closeWebcard();
  };
  const onCancel = async () => {
    autofillEngineCommands?.cancelSaveCredential();
    passwordLimitStatus.shouldShowPasswordLimitReached || isB2BDiscontinued
      ? autofillEngineCommands?.logEvent(
          new UserCallToActionEvent({
            callToActionList: [CallToAction.BuyDashlane, CallToAction.Dismiss],
            chosenAction: CallToAction.Dismiss,
            hasChosenNoAction: false,
          })
        )
      : autofillEngineCommands?.logEvent(
          new UserAutofillDismissEvent({
            dismissType: DismissType.Cancel,
          })
        );
    autofillEngineCommands?.logEvent(
      new AnonymousAutofillDismissEvent({
        domain: {
          type: DomainType.Web,
          id: await hashDomain(domain ?? ""),
        },
        isNativeApp: false,
        dismissType: DismissType.Cancel,
      })
    );
    closeWebcard();
  };
  const handleSave = async () => {
    logAcceptEvent(WebcardSaveOptions.Save);
    if (await checkWebcardVisible()) {
      autofillEngineCommands?.saveCredential(webcardId, {
        emailOrLogin,
        capturedUsernames,
        password: passwordToSave,
        url,
        onlyForThisSubdomain: checkSubdomainOpt,
        protectWithMasterPassword: checkProtectedOpt,
        spaceId: showSpacesList ? selectedSpaceId : undefined,
        selectedCollection: selectedCollection,
      });
    }
  };
  const handleClickOnBuyDashlane = () => {
    autofillEngineCommands &&
      setAutofillEngineActionsHandlers &&
      (isB2BDiscontinued
        ? redirectToBuyDashlaneB2B(
            autofillEngineCommands,
            setAutofillEngineActionsHandlers
          )
        : redirectToGetPremiumPage(
            autofillEngineCommands,
            setAutofillEngineActionsHandlers
          ));
    autofillEngineCommands?.logEvent(
      new UserCallToActionEvent({
        callToActionList: [CallToAction.BuyDashlane, CallToAction.Dismiss],
        chosenAction: CallToAction.BuyDashlane,
        hasChosenNoAction: false,
      })
    );
  };
  const onSubmitForm = (event: React.FormEvent) => {
    event.preventDefault();
    handleSave();
  };
  const onClickExtraInfo = () => {
    setDisplayExtraInfo(!displayExtraInfo);
    autofillEngineCommands?.logEvent(
      new UserAutofillClickEvent({
        autofillButton: AutofillButton.ShowOption,
      })
    );
  };
  React.useEffect(() => {
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === KEYBOARD_EVENTS.ESCAPE) {
        onClose({ withEscapeKey: true });
      }
    };
    window.addEventListener("keyup", closeOnEscape);
    return () => window.removeEventListener("keyup", closeOnEscape);
  }, []);
  const selectedSpace = spaces.find(
    ({ spaceId }) => spaceId === selectedSpaceId
  );
  const dropdownElementsToDisplayForEmails = displayExtraInfo ? 5 : 3;
  const dropdownElementsToDisplayForSpaces = 2;
  const handleClickCreateNewLogin = () => {
    setIsReplaceWebcardFormat(false);
    setHasBackButton(true);
    logAcceptEvent(WebcardSaveOptions.SaveAsNew);
  };
  const handleClickOnBackButton = () => {
    setIsReplaceWebcardFormat((toggle) => !toggle);
    setHasBackButton(false);
  };
  const handleReplace = (item?: WebcardItem) => {
    if (item) {
      const itemPosition = existingCredentialsForDomain.indexOf(item) + 1;
      logAcceptEvent(WebcardSaveOptions.Replace, itemPosition);
    }
    autofillEngineCommands?.updateCredential(webcardId, {
      id: item?.itemId ?? existingCredentialId,
      title: item?.title ?? "",
      newPassword: passwordToSave,
      onlyForThisSubdomain: checkSubdomainOpt,
      spaceId:
        showSpacesList && !isReplaceWebcardFormat ? selectedSpaceId : undefined,
    });
  };
  const handleClickUpgradeFromNearLimitWarning = async () => {
    autofillEngineCommands?.logEvent(
      new UserClickEvent({
        clickOrigin:
          ClickOrigin.SavePasswordWebcardPasswordLimitCloseToBeReached,
        button: HermesButton.BuyDashlane,
      })
    );
    closeWebcard();
  };
  const shouldShowExtraInfoInFooter =
    (showSpacesList || allowMasterPasswordProtection || showSubdomainOpt) &&
    !passwordLimitStatus.shouldShowPasswordLimitReached &&
    !isB2BDiscontinued;
  const footerContent = (
    <SavePasswordFooter
      displayExtraInfo={displayExtraInfo}
      emailOrLogin={emailOrLogin}
      formId={FORM_ID}
      isReplaceWebcardFormat={isReplaceWebcardFormat}
      isLimited={passwordLimitStatus.shouldShowPasswordLimitReached}
      passwordsLeft={passwordLimitStatus.passwordsLeft}
      isNearLimit={passwordLimitStatus.shouldShowNearPasswordLimit}
      isB2BDiscontinued={isB2BDiscontinued}
      saveButtonRef={saveButton}
      mainButtonLabel={translate(I18N_KEYS.BUTTON_SAVE)}
      handleClickCreateNewLogin={handleClickCreateNewLogin}
      handleClickOnBuyDashlane={handleClickOnBuyDashlane}
      handleReplace={handleReplace}
      onCancel={onCancel}
      onClickExtraInfo={onClickExtraInfo}
      withExtraInfoButton={shouldShowExtraInfoInFooter}
      accountSubscriptionCode={subscriptionCode}
      handleClickUpgradeFromNearLimitWarning={
        handleClickUpgradeFromNearLimitWarning
      }
    />
  );
  const getHeaderTitle = () => {
    if (isB2BDiscontinued) {
      return translate(I18N_KEYS.HEADER_TITLE_B2B_TRIAL_DISCONTINUED);
    }
    if (isReplaceWebcardFormat) {
      return translate(
        passwordLimitStatus.shouldShowPasswordLimitReached
          ? I18N_KEYS.HEADER_TITLE_UPDATE_OR_CREATE_NEW_LIMIT
          : I18N_KEYS.HEADER_TITLE_UPDATE_OR_CREATE_NEW
      );
    }
    return translate(I18N_KEYS.HEADER_TITLE_NOHTML);
  };
  const passwordInput = (
    <PasswordField
      id={SAVE_PWD_READONLY_ID}
      label={translate(I18N_KEYS.LABEL_PASSWORD_FIELD)}
      toggleVisibilityLabel={{
        show: translate(I18N_KEYS.BUTTON_SHOW_PASSWORD),
        hide: translate(I18N_KEYS.BUTTON_HIDE_PASSWORD),
      }}
      value={passwordToSave}
      readOnly
      onValueVisibilityChangeRequest={async () => {
        if (event) {
          event.preventDefault();
        }
      }}
      data-keyboard-accessible={translate(I18N_KEYS.BUTTON_SHOW_PASSWORD)}
    />
  );
  return (
    <DialogContainer
      closeWebcard={onClose}
      footerContent={footerContent}
      headerContent={
        <Flex alignItems="flex-start" gap="8px">
          {hasBackButton ? (
            <Button
              id="save-password-back-button"
              mood="neutral"
              intensity="supershy"
              icon="ArrowLeftOutlined"
              layout="iconOnly"
              type="button"
              onClick={handleClickOnBackButton}
              size="small"
              data-keyboard-accessible
              aria-hidden
            />
          ) : null}
          <HeaderTitle title={getHeaderTitle()} />
        </Flex>
      }
      withHeaderCloseButton
      withHeaderLogo={!hasBackButton}
    >
      {isReplaceWebcardFormat ? (
        <React.Fragment>
          {passwordInput}
          <SuggestedItemsList
            onAddNewItem={closeWebcard}
            items={existingCredentialsForDomain}
            onClickItem={handleReplace}
            withScroll={true}
            withLastUsedBadge={existingCredentialsForDomain.length > 2}
          />
        </React.Fragment>
      ) : (
        <form id={FORM_ID} sx={{ padding: "4px" }} onSubmit={onSubmitForm}>
          <Flex gap="8px" flexDirection="column">
            {fullDomain ? (
              <ItemHeader
                thumbnail={<ExpressiveIcon name="ItemLoginOutlined" />}
                title={fullDomain}
                sx={{
                  width: "100%",
                  backgroundColor: "ds.container.agnostic.neutral.standard",
                  padding: "8px",
                  borderRadius: "8px",
                }}
              />
            ) : null}
            <Combobox
              id={SAVE_PWD_COMBOBOX_ID}
              label={translate(I18N_KEYS.LABEL_LOGIN_FIELD)}
              placeholder={translate(I18N_KEYS.PLACEHOLDER_LOGIN)}
              value={emailOrLogin}
              options={dropdownLoginOptions.map(
                (value: string, key: number) => ({
                  id: SAVE_PWD_COMBOBOX_ID,
                  value,
                  key,
                })
              )}
              onChange={onEmailChange}
              canAddNewValue
              isErrored={isInputErrored}
              isReadOnly={
                isB2BDiscontinued ||
                passwordLimitStatus.shouldShowPasswordLimitReached
              }
              focusOnMount={!emailOrLogin && !isB2BDiscontinued}
              dropdownElementsToDisplay={dropdownElementsToDisplayForEmails}
              boldEmailDomains={true}
              required={true}
              data-keyboard-accessible={translate(I18N_KEYS.PLACEHOLDER_LOGIN)}
            />

            {passwordInput}

            {displayExtraInfo ? (
              <React.Fragment>
                {showSpacesList ? (
                  <div>
                    <Combobox
                      id={SAVE_PWD_COMBOBOX_SPACE_ID}
                      value={selectedSpace?.displayName}
                      options={spaces.map((space) => ({
                        id: SAVE_PWD_COMBOBOX_SPACE_ID,
                        value: space.displayName,
                        key: space.spaceId,
                      }))}
                      onChange={onSpaceChange}
                      letter={selectedSpace?.letter}
                      color={selectedSpace?.color}
                      name={selectedSpace?.displayName}
                      dropdownElementsToDisplay={
                        dropdownElementsToDisplayForSpaces
                      }
                      data-keyboard-accessible
                    />
                  </div>
                ) : null}
                {showCollectionList ? (
                  <div>
                    <Combobox
                      label={translate(
                        I18N_KEYS.SAVE_WEBCARD_ADD_COLLECTION_SELECT_LABEL
                      )}
                      placeholder={translate(
                        I18N_KEYS.SAVE_WEBCARD_ADD_COLLECTION_SELECT_LABEL
                      )}
                      id={SAVE_PWD_COMBOBOX_COLLECTION_ID}
                      value={selectedCollection?.name}
                      options={
                        collections
                          ? collections.map((collection) => ({
                              id: SAVE_PWD_COMBOBOX_COLLECTION_ID,
                              value: collection.name,
                              key: collection.id,
                            }))
                          : []
                      }
                      onChange={onCollectionChange}
                      name={selectedCollection?.name}
                      dropdownElementsToDisplay={
                        dropdownElementsToDisplayForSpaces
                      }
                      data-keyboard-accessible
                    />
                  </div>
                ) : null}

                <div>
                  {allowMasterPasswordProtection ? (
                    <Checkbox
                      id={SAVE_PWD_PROTECTED_OPT_LABEL_ID}
                      label={translate(I18N_KEYS.OPTION_ALWAYS_USE_MP)}
                      checked={checkProtectedOpt || false}
                      onChange={(e) =>
                        setCheckProtectedOpt(e.currentTarget.checked)
                      }
                      data-keyboard-accessible={translate(
                        I18N_KEYS.OPTION_ALWAYS_USE_MP
                      )}
                    />
                  ) : null}

                  {showSubdomainOpt ? (
                    <Checkbox
                      id={SAVE_PWD_SUBDOMAIN_OPT_LABEL_ID}
                      label={translate(I18N_KEYS.OPTION_ONLY_ON_SUBDOMAIN)}
                      checked={checkSubdomainOpt || false}
                      onChange={(e) =>
                        setCheckSubdomainOpt(e.currentTarget.checked)
                      }
                      data-keyboard-accessible={translate(
                        I18N_KEYS.OPTION_ONLY_ON_SUBDOMAIN
                      )}
                    />
                  ) : null}
                </div>
              </React.Fragment>
            ) : null}
          </Flex>
        </form>
      )}
    </DialogContainer>
  );
};
