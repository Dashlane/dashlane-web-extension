import * as React from "react";
import { VaultSourceType } from "@dashlane/autofill-contracts";
import {
  AutofillCredentialsAtRisk,
  AutofillDropdownWebcardWarningType,
  AutofillRequestOriginType,
  ClassicDropdownWebcardData,
  dropdownWebcardWarningTypeToHermesWarningType,
  filterWebcardMetadataStore,
  vaultSourceTypeToHermesItemTypeMap,
  WebcardItem,
} from "@dashlane/autofill-engine/dist/autofill-engine/src/types";
import {
  AnonymousAutofillAcceptEvent,
  AnonymousAutofillSuggestEvent,
  BrowseComponent,
  DismissType,
  DomainType,
  hashDomain,
  ItemType,
  PageView,
  UserAutofillAcceptEvent,
  UserAutofillDismissEvent,
  UserAutofillSuggestEvent,
} from "@dashlane/hermes";
import { useTranslate } from "../../../context/i18n";
import { usePerformanceContext } from "../../../context/performance";
import { useCommunication } from "../../../context/communication";
import { vaultSourceTypeKeyMap } from "../../../utils/formatter/keys";
import { getSelectedItemPositionForLog } from "../../../utils/logs";
import { useWebcardVisibilityChecker } from "../../common/hooks/visibilityChecker";
import { DropdownContainer } from "../../common/layout/DropdownContainer";
import { HeaderTitle } from "../../common/layout/HeaderTitle";
import { WebcardPropsBase } from "../config";
import { AutofillFooter } from "./AutofillFooter";
import { SuggestedItemsList } from "./SuggestedItemsList";
import { vaultSourceTypeToPageViewMap } from "./EmptyPanel";
import { ButtonItem } from "../../common/items/ButtonItem";
import { WebcardItemDetailedView } from "./common/WebcardItemDetailedView";
const I18N_KEYS = {
  CONDITIONAL_UI_FALLBACK_BUTTON: "webauthnConditionalUINotWithDashlaneButton",
};
interface Props extends WebcardPropsBase {
  data: ClassicDropdownWebcardData;
}
export const Autofill = ({ data, closeWebcard }: Props) => {
  const {
    autofillRecipes,
    webcardId,
    webcardType,
    items,
    formType,
    fieldType,
    warningType,
    srcElement,
    tabRootDomain,
    withSearch,
    withNonDashlaneKeyButton,
    webauthnRequest,
  } = data;
  const { translate } = useTranslate();
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
  const timeToWebcard = usePerformanceContext();
  const [isSearchActive, setIsSearchActive] = React.useState(false);
  const [srcElementValue, setSrcElementValue] = React.useState("");
  const [credentialsAtRisk, setCredentialsAtRisk] = React.useState<
    AutofillCredentialsAtRisk | undefined
  >(undefined);
  const firstFieldType = fieldType?.[0];
  const cardTitle = (() => {
    if (items && items.length > 0) {
      return translate(`types_${vaultSourceTypeKeyMap[items[0].itemType]}`);
    } else if (firstFieldType) {
      return translate(`types_${vaultSourceTypeKeyMap[firstFieldType]}`);
    }
    return "";
  })();
  React.useEffect(() => {
    if (items.length > 0) {
      autofillEngineCommands?.logPageView({
        pageView: PageView.AutofillDropdownSuggestion,
        browseComponent: BrowseComponent.Webcard,
      });
      return;
    }
    const pageView = firstFieldType
      ? vaultSourceTypeToPageViewMap[firstFieldType]
      : undefined;
    if (pageView) {
      autofillEngineCommands?.logPageView({
        pageView,
        browseComponent: BrowseComponent.Webcard,
      });
    }
  }, [autofillEngineCommands, firstFieldType, items.length]);
  React.useEffect(() => {
    if (!timeToWebcard) {
      return;
    }
    let vaultTypeList: ItemType[] = [];
    vaultTypeList = items.reduce(
      (acc: ItemType[], currentItem: WebcardItem) => {
        const mappedHermesItemType =
          vaultSourceTypeToHermesItemTypeMap[currentItem.itemType];
        if (
          mappedHermesItemType &&
          !acc.includes(mappedHermesItemType) &&
          mappedHermesItemType !== ItemType.GeneratedPassword
        ) {
          acc.push(mappedHermesItemType);
        }
        return acc;
      },
      []
    );
    const isSuggestLastUnsaved =
      vaultTypeList.includes(ItemType.Credential) &&
      items.some((item) => item.itemType === VaultSourceType.GeneratedPassword);
    autofillEngineCommands?.logEvent(
      new UserAutofillSuggestEvent({
        isNativeApp: false,
        vaultTypeList,
        msToWebcard: timeToWebcard,
        webcardItemTotalCount: items.length,
        isSuggestLastUnsaved,
        autofillMessageTypeList: warningType
          ? [dropdownWebcardWarningTypeToHermesWarningType[warningType]]
          : undefined,
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
          vaultTypeList,
          msToWebcard: timeToWebcard,
          webcardItemTotalCount: items.length,
          isSuggestLastUnsaved,
          autofillMessageTypeList: warningType
            ? [dropdownWebcardWarningTypeToHermesWarningType[warningType]]
            : undefined,
        })
      );
    })();
  }, [
    autofillEngineCommands,
    items,
    tabRootDomain,
    timeToWebcard,
    warningType,
  ]);
  React.useEffect(() => {
    setAutofillEngineActionsHandlers?.({
      updateWebcardCredentialsAtRisk: (credentialsAtRisk) => {
        setCredentialsAtRisk(credentialsAtRisk);
      },
    });
    const credentialIds = items
      .filter(({ itemType }) => itemType === VaultSourceType.Credential)
      .map(({ itemId }) => itemId);
    if (credentialIds.length > 0) {
      autofillEngineCommands?.getCredentialsAtRiskByIds(credentialIds);
    }
  }, [
    setAutofillEngineActionsHandlers,
    setCredentialsAtRisk,
    autofillEngineCommands,
    items,
  ]);
  const onClick = async (item: WebcardItem) => {
    const isProtected = item.isProtected;
    const hermesItemType = vaultSourceTypeToHermesItemTypeMap[item.itemType];
    if (hermesItemType) {
      autofillEngineCommands?.logEvent(
        new UserAutofillAcceptEvent({
          dataTypeList: [hermesItemType],
          itemPosition: getSelectedItemPositionForLog(items, item),
          isProtected,
        })
      );
    }
    autofillEngineCommands?.logEvent(
      new AnonymousAutofillAcceptEvent({
        domain: {
          type: DomainType.Web,
          id: await hashDomain(tabRootDomain ?? ""),
        },
        itemPosition: getSelectedItemPositionForLog(items, item),
        isProtected,
      })
    );
    if (item.metadataKeys && data.metadata) {
      if (await checkWebcardVisible()) {
        const metadata = filterWebcardMetadataStore(
          data.metadata,
          item.metadataKeys
        );
        autofillEngineCommands?.webcardItemSelected(item, metadata, webcardId);
      }
      if (item.closeOnSelect !== false) {
        closeWebcard();
      }
    } else {
      const autofillRecipe = autofillRecipes[item.itemType];
      if (autofillRecipe && (await checkWebcardVisible())) {
        autofillEngineCommands?.applyAutofillRecipe({
          autofillRecipe,
          dataSource: {
            type: item.itemType,
            vaultId: item.itemId,
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
    }
  };
  const onUseOtherAuthenticator = async () => {
    autofillEngineCommands?.logEvent(
      new UserAutofillDismissEvent({
        dismissType: DismissType.UseLocalPasskey,
      })
    );
    if (webauthnRequest) {
      autofillEngineCommands?.webauthnUseOtherAuthenticator(webauthnRequest);
    }
    closeWebcard();
  };
  const [showItemDetails, setShowItemDetails] = React.useState(false);
  const [selectedItem, setSelectedItem] = React.useState<WebcardItem>();
  const onClickItemDetails = (item: WebcardItem) => {
    setShowItemDetails(true);
    setSelectedItem(item);
  };
  const onCloseItemDetails = () => {
    setShowItemDetails(false);
    setSelectedItem(undefined);
  };
  const footerContent =
    warningType &&
    warningType !==
      AutofillDropdownWebcardWarningType.PossibleDuplicateRegistration ? (
      <AutofillFooter
        context={data.context}
        warningType={data.warningType}
        closeWebcard={closeWebcard}
      />
    ) : null;
  return showItemDetails && selectedItem ? (
    <WebcardItemDetailedView
      closeWebcard={closeWebcard}
      onCloseItemDetails={onCloseItemDetails}
      webcardInfos={data}
      webcardItem={selectedItem}
    />
  ) : (
    <DropdownContainer
      closeWebcard={closeWebcard}
      headerContent={<HeaderTitle title={cardTitle} />}
      footerContent={footerContent}
      isSearchActive={isSearchActive}
      srcElementValue={srcElementValue}
      webcardData={data}
      withHeaderLogo
      withHeaderOptionsButton
      withHeaderSearchButton={withSearch}
      withFooterPadding={false}
      withNoMainPadding
    >
      <SuggestedItemsList
        onAddNewItem={closeWebcard}
        fieldType={firstFieldType}
        items={items}
        onClickItem={onClick}
        onClickItemDetails={onClickItemDetails}
        tabRootDomain={data.tabRootDomain}
        tabUrl={data.tabUrl}
        withScroll
        withAddNewButton={!withNonDashlaneKeyButton}
        credentialsAtRisk={credentialsAtRisk}
      />
      {withNonDashlaneKeyButton ? (
        <ButtonItem
          icon={VaultSourceType.Passkey}
          key="nonDashlaneKeyButton"
          onClick={onUseOtherAuthenticator}
          value={translate(I18N_KEYS.CONDITIONAL_UI_FALLBACK_BUTTON)}
        />
      ) : null}
    </DropdownContainer>
  );
};
