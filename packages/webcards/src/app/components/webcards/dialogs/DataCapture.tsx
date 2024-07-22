import * as React from "react";
import classNames from "classnames";
import {
  DataCaptureWebcardData,
  vaultSourceTypeToHermesItemTypeMap,
} from "@dashlane/autofill-engine/dist/autofill-engine/src/types";
import { DataCaptureWebcardItem } from "@dashlane/autofill-engine/dist/autofill-engine/src/Api/types/data-capture";
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
import { KEYBOARD_EVENTS } from "../../../constants";
import { useWebcardVisibilityChecker } from "../../common/hooks/visibilityChecker";
import { DialogContainer } from "../../common/layout/DialogContainer";
import { HeaderTitle } from "../../common/layout/HeaderTitle";
import { List } from "../../common/generic/List";
import { SecondaryActionButton } from "../../common/generic/buttons/SecondaryActionButton";
import { PrimarySubmitButton } from "../../common/generic/buttons/PrimarySubmitButton";
import { WebcardPropsBase } from "../config";
import { DataCaptureItem } from "./items/DataCaptureItem";
import styles from "./DataCapture.module.scss";
const FORM_ID = "data-capture-form";
const I18N_KEYS = {
  BUTTON_SAVE: "save",
};
interface Props extends WebcardPropsBase {
  data: DataCaptureWebcardData;
}
type ItemState = {
  checked: boolean;
};
const defaultItemState: ItemState = {
  checked: true,
};
export const DataCapture = ({ data, closeWebcard }: Props) => {
  const { translate } = React.useContext(I18nContext);
  const { autofillEngineCommands, autofillEngineDispatcher } =
    useCommunication();
  const { data: itemsData, tabRootDomain, webcardId } = data;
  const checkWebcardVisible = useWebcardVisibilityChecker({
    webcardId,
    autofillEngineDispatcher,
    closeWebcard,
  });
  const timeToWebcard = usePerformanceContext();
  React.useEffect(() => {
    autofillEngineCommands?.logPageView({
      pageView: PageView.AutofillNotificationDataCapture,
      browseComponent: BrowseComponent.Webcard,
    });
  }, [autofillEngineCommands]);
  React.useEffect(() => {
    const vaultTypeList: ItemType[] = itemsData.reduce(
      (res: ItemType[], item: DataCaptureWebcardItem) => {
        const itemType = vaultSourceTypeToHermesItemTypeMap[item.type];
        if (itemType) {
          res.push(itemType);
        }
        return res;
      },
      []
    );
    if (timeToWebcard) {
      autofillEngineCommands?.logEvent(
        new UserAutofillSuggestEvent({
          isNativeApp: false,
          vaultTypeList,
          msToWebcard: timeToWebcard,
        })
      );
      (async () => {
        autofillEngineCommands?.logEvent(
          new AnonymousAutofillSuggestEvent({
            isNativeApp: false,
            vaultTypeList,
            domain: {
              type: DomainType.Web,
              id: await hashDomain(tabRootDomain ?? ""),
            },
            msToWebcard: timeToWebcard,
          })
        );
      })();
    }
  }, [autofillEngineCommands, itemsData, tabRootDomain, timeToWebcard]);
  const [itemsState, setItemsState] = React.useState<ItemState[]>([]);
  const getItemState = (id: number): ItemState => {
    return itemsState[id] ?? defaultItemState;
  };
  const updateItemState = (id: number, update: Partial<ItemState>): void => {
    setItemsState((states) => {
      const newStates = [...states];
      const previousState = states[id] ?? defaultItemState;
      newStates[id] = { ...previousState, ...update };
      return newStates;
    });
  };
  const onClose = async ({ withEscapeKey = false } = {}) => {
    autofillEngineCommands?.logEvent(
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
          id: await hashDomain(tabRootDomain ?? ""),
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
    autofillEngineCommands?.logEvent(
      new UserAutofillDismissEvent({
        dismissType: DismissType.Cancel,
      })
    );
    autofillEngineCommands?.logEvent(
      new AnonymousAutofillDismissEvent({
        domain: {
          type: DomainType.Web,
          id: await hashDomain(tabRootDomain ?? ""),
        },
        isNativeApp: false,
        dismissType: DismissType.Cancel,
      })
    );
    closeWebcard();
  };
  const onSave = async () => {
    const checkedItems: DataCaptureWebcardItem[] = [];
    itemsData.forEach((item: DataCaptureWebcardItem, index: number) => {
      if (getItemState(index).checked) {
        checkedItems.push(item);
      }
    });
    autofillEngineCommands?.logEvent(
      new UserAutofillAcceptEvent({
        dataTypeList: checkedItems.reduce(
          (res: ItemType[], item: DataCaptureWebcardItem) => {
            const itemType = vaultSourceTypeToHermesItemTypeMap[item.type];
            if (itemType) {
              res.push(itemType);
            }
            return res;
          },
          []
        ),
      })
    );
    (async () => {
      autofillEngineCommands?.logEvent(
        new AnonymousAutofillAcceptEvent({
          domain: {
            type: DomainType.Web,
            id: await hashDomain(tabRootDomain ?? ""),
          },
        })
      );
    })();
    if (await checkWebcardVisible()) {
      autofillEngineCommands?.savePersonalData(checkedItems);
    }
    closeWebcard();
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
  const dataCaptureItems = itemsData.map(
    (item: DataCaptureWebcardItem, index: number) => (
      <DataCaptureItem
        key={index}
        id={index}
        item={item}
        checked={getItemState(index).checked}
        onClick={(checked) => updateItemState(index, { checked })}
      />
    )
  );
  return (
    <DialogContainer
      closeWebcard={onClose}
      footerContent={
        <div className={classNames(styles.footer)}>
          <div className={styles.buttonsContainer}>
            <SecondaryActionButton
              onClick={onCancel}
              label={translate("cancel")}
            />
            <PrimarySubmitButton
              form={FORM_ID}
              label={translate(I18N_KEYS.BUTTON_SAVE)}
            />
          </div>
        </div>
      }
      headerContent={<HeaderTitle title={translate("header")} />}
      withHeaderCloseButton
      withHeaderLogo
    >
      <form
        id={FORM_ID}
        onSubmit={(event) => {
          event.preventDefault();
          onSave();
        }}
      >
        <List
          data={dataCaptureItems}
          pager={{
            displayDot: false,
            hasScroll: false,
          }}
        />
      </form>
    </DialogContainer>
  );
};
