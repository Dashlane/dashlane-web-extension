import * as React from "react";
import {
  AutofillRequestOriginType,
  AutologinSelectionWebcardData,
  WebcardItem,
} from "@dashlane/autofill-engine/dist/autofill-engine/src/types";
import {
  AnonymousAutofillAcceptEvent,
  AnonymousAutofillDismissEvent,
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
import { I18nContext } from "../../../context/i18n";
import { useCommunication } from "../../../context/communication";
import { usePerformanceContext } from "../../../context/performance";
import { DialogContainer } from "../../common/layout/DialogContainer";
import { HeaderTitle } from "../../common/layout/HeaderTitle";
import { getSelectedItemPositionForLog } from "../../../utils/logs";
import { useWebcardVisibilityChecker } from "../../common/hooks/visibilityChecker";
import { SuggestedItemsList } from "../dropdowns/SuggestedItemsList";
import { WebcardPropsBase } from "../config";
interface Props extends WebcardPropsBase {
  data: AutologinSelectionWebcardData;
}
export const AutoLoginSelection = ({
  data: {
    autofillRecipes,
    formType,
    webcardType,
    webcards,
    extensionShortcuts,
    tabRootDomain,
    webcardId,
  },
  closeWebcard,
}: Props) => {
  const { translate } = React.useContext(I18nContext);
  const { autofillEngineCommands, autofillEngineDispatcher } =
    useCommunication();
  const timeToWebcard = usePerformanceContext();
  const checkWebcardVisible = useWebcardVisibilityChecker({
    webcardId,
    autofillEngineDispatcher,
    closeWebcard,
  });
  React.useEffect(() => {
    autofillEngineCommands?.logPageView({
      pageView: PageView.AutofillNotificationSuggestion,
      browseComponent: BrowseComponent.Webcard,
    });
  }, [autofillEngineCommands]);
  React.useEffect(() => {
    if (timeToWebcard) {
      autofillEngineCommands?.logEvent(
        new UserAutofillSuggestEvent({
          isNativeApp: false,
          msToWebcard: timeToWebcard,
          vaultTypeList: [ItemType.Credential],
          webcardItemTotalCount: webcards.length,
        })
      );
      (async () => {
        autofillEngineCommands?.logEvent(
          new AnonymousAutofillSuggestEvent({
            domain: {
              type: DomainType.Web,
              id: await hashDomain(tabRootDomain ?? ""),
            },
            vaultTypeList: [ItemType.Credential],
            isNativeApp: false,
            msToWebcard: timeToWebcard,
            webcardItemTotalCount: webcards.length,
          })
        );
      })();
    }
  }, [autofillEngineCommands, tabRootDomain, timeToWebcard, webcards.length]);
  const onClose = async () => {
    autofillEngineCommands?.logEvent(
      new UserAutofillDismissEvent({
        dismissType: DismissType.CloseCross,
      })
    );
    autofillEngineCommands?.logEvent(
      new AnonymousAutofillDismissEvent({
        domain: {
          type: DomainType.Web,
          id: await hashDomain(tabRootDomain ?? ""),
        },
        isNativeApp: false,
        dismissType: DismissType.CloseCross,
      })
    );
    closeWebcard();
  };
  const onClick = async (item: WebcardItem) => {
    const isProtected = item.isProtected;
    autofillEngineCommands?.logEvent(
      new UserAutofillAcceptEvent({
        dataTypeList: [ItemType.Credential],
        itemPosition: getSelectedItemPositionForLog(webcards, item),
        isProtected: isProtected,
      })
    );
    (async () => {
      autofillEngineCommands?.logEvent(
        new AnonymousAutofillAcceptEvent({
          domain: {
            type: DomainType.Web,
            id: await hashDomain(tabRootDomain ?? ""),
          },
          itemPosition: getSelectedItemPositionForLog(webcards, item),
          isProtected: isProtected,
        })
      );
    })();
    const autofillRecipe = autofillRecipes[item.itemType];
    if (autofillRecipe && (await checkWebcardVisible())) {
      autofillEngineCommands?.applyAutofillRecipe({
        autofillRecipe,
        dataSource: {
          type: item.itemType,
          vaultId: item.itemId,
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
  return (
    <DialogContainer
      closeWebcard={onClose}
      extensionShortcuts={extensionShortcuts}
      headerContent={<HeaderTitle title={translate("header")} />}
      withHeaderCloseButton
      withHeaderLogo
      withNoMainPadding
    >
      <SuggestedItemsList
        onAddNewItem={onClose}
        items={webcards}
        onClickItem={onClick}
        withPages
      />
    </DialogContainer>
  );
};
