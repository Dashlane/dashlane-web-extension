import React from "react";
import { Button, Icon, jsx } from "@dashlane/design-system";
import {
  AutofillDropdownWebcardDataBase,
  AutofillRequestOriginType,
  WebcardItem,
  WebcardItemProperties,
} from "@dashlane/autofill-engine/types";
import {
  VaultAutofillViewInterfaces,
  VaultSourceType,
} from "@dashlane/autofill-contracts";
import { I18nContext } from "../../../../context/i18n";
import { useCommunication } from "../../../../context/communication";
import { CardLayout } from "../../../common/layout/CardLayout";
import { Header } from "../../../common/layout/Header";
import { HeaderTitle } from "../../../common/layout/HeaderTitle";
import { List } from "../../../common/generic/List";
import { getIconName } from "../../../common/icons/icons";
import { vaultSourceTypeToWebappRouteNameMap } from "../../../../utils/routes/routes";
import { SX_STYLES as ITEM_STYLES } from "../../../common/items/Items.styles";
import { WebcardItemDetailedViewRow } from "./WebcardItemDetailedViewRow";
import {
  SECOND_STEP_CARDS,
  SelfCorrectingAutofillOptionItem,
  SelfCorrectingAutofillWebcardStep,
  SOURCE_TYPE_TO_LOCALIZATION_KEY,
} from "./SelfCorrectingTree";
import { SelfCorrectingContent } from "./SelfCorrectingContent";
import { SX_STYLES as HEADER_STYLES } from "../../../common/layout/Header.styles";
const SX_STYLES = {
  BACK_ARROW: {
    cursor: "pointer",
    backgroundColor: "transparent",
    marginRight: "8px",
  },
  ICON_CONTAINER: {
    ...ITEM_STYLES.ICON_CONTAINER,
    margin: "8px 0px",
  },
};
export interface WebcardItemDetailedViewProps {
  closeWebcard: () => void;
  onCloseItemDetails: () => void;
  webcardInfos: AutofillDropdownWebcardDataBase;
  webcardItem: WebcardItem;
}
export const WebcardItemDetailedView = ({
  closeWebcard,
  onCloseItemDetails,
  webcardInfos,
  webcardItem,
}: WebcardItemDetailedViewProps) => {
  const { title, itemId, itemType } = webcardItem;
  const { autofillEngineCommands, setAutofillEngineActionsHandlers } =
    useCommunication();
  const { translate } = React.useContext(I18nContext);
  const [itemProperties, setItemProperties] = React.useState<
    WebcardItemProperties<typeof itemType>
  >({});
  const iconName = getIconName(itemType);
  const selfCorrectingOptions = SECOND_STEP_CARDS[itemType];
  const validItemProperties = (
    Object.keys(itemProperties) as Array<
      keyof VaultAutofillViewInterfaces[typeof itemType]
    >
  ).filter((property) => Boolean(itemProperties[property]));
  const shouldDisplayItemDetails =
    validItemProperties.length > 0 || !selfCorrectingOptions;
  const findLocalizationKeyForProperty = (
    property: keyof VaultAutofillViewInterfaces[typeof itemType]
  ) =>
    Object.values(SECOND_STEP_CARDS)
      .flatMap((item) => item)
      .find(
        (option) =>
          option.itemType === itemType && option.itemProperty === property
      )?.localizationKey ?? property.toString();
  const onClickItemProperty = (
    property: keyof VaultAutofillViewInterfaces[typeof itemType]
  ) => {
    const correctAutofillIngredientFromRecipes = webcardInfos.autofillRecipes[
      itemType
    ]?.ingredients.find(
      (ing) =>
        ing.frameId === webcardInfos.srcElement.frameId &&
        ing.srcElementId === webcardInfos.srcElement.elementId &&
        ing.ingredient.type === itemType &&
        ing.ingredient.property === property
    );
    if (correctAutofillIngredientFromRecipes) {
      autofillEngineCommands?.applyAutofillRecipe({
        autofillRecipe: {
          ingredients: [correctAutofillIngredientFromRecipes],
        },
        dataSource: {
          type: itemType,
          vaultId: itemId,
        },
        focusedElement: {
          elementId: webcardInfos.srcElement.elementId,
          frameId: webcardInfos.srcElement.frameId,
        },
        formClassification: webcardInfos.formType,
        requestOrigin: {
          type: AutofillRequestOriginType.Webcard,
          webcardType: webcardInfos.webcardType,
        },
      });
      closeWebcard();
    } else {
      autofillEngineCommands?.applySelfCorrectingAutofill(webcardInfos, {
        dataSource: { [itemType]: property },
        selectedItem: webcardItem,
      });
    }
  };
  const onClickItemOption = (option: SelfCorrectingAutofillOptionItem) => {
    onClickItemProperty(
      option.itemProperty as keyof VaultAutofillViewInterfaces[typeof itemType]
    );
  };
  const onClickEditItem = () => {
    const route = vaultSourceTypeToWebappRouteNameMap[itemType];
    autofillEngineCommands?.openWebapp({
      route,
      id: itemId,
    });
    closeWebcard();
  };
  React.useEffect(() => {
    autofillEngineCommands?.getVaultItemDetails(itemId, itemType);
  }, [autofillEngineCommands, itemId, itemType]);
  setAutofillEngineActionsHandlers?.({
    updateWebcardItemDetails: (aItemId, aItemType, aItemProperties) => {
      if (aItemId === itemId && aItemType === itemType) {
        setItemProperties(aItemProperties);
      }
    },
  });
  const header = (
    <Header isDropdown>
      <Button
        type="button"
        mood="neutral"
        intensity="supershy"
        size="small"
        layout="iconOnly"
        onClick={(e) => {
          e.stopPropagation();
          onCloseItemDetails();
        }}
        icon={<Icon name="ArrowLeftOutlined" aria-hidden />}
        data-keyboard-accessible
      />
      {iconName ? (
        <Icon
          name={iconName}
          color="ds.text.neutral.standard"
          sx={{ mr: "4px" }}
        />
      ) : null}
      <HeaderTitle
        title={
          shouldDisplayItemDetails
            ? title
            : translate(SOURCE_TYPE_TO_LOCALIZATION_KEY[itemType])
        }
      />
      {shouldDisplayItemDetails ? (
        <Button
          type="button"
          mood="neutral"
          intensity="supershy"
          size="small"
          layout="iconOnly"
          sx={{ ...HEADER_STYLES.DROPDOWN_ACTION, marginLeft: "auto" }}
          onClick={(e) => {
            e.stopPropagation();
            onClickEditItem();
          }}
          icon={<Icon name="ActionEditOutlined" aria-hidden />}
          data-keyboard-accessible
        />
      ) : null}
    </Header>
  );
  const cardContent = shouldDisplayItemDetails ? (
    <List
      pager={{
        displayDot: false,
        hasScroll: true,
      }}
      data={validItemProperties.map((itemProperty) => {
        const isDisabled =
          itemType === VaultSourceType.Credential &&
          (itemProperty as keyof VaultAutofillViewInterfaces[typeof itemType]) ===
            "password" &&
          !webcardInfos.srcElement.isInputPassword;
        return (
          <WebcardItemDetailedViewRow
            onClick={() => onClickItemProperty(itemProperty)}
            key={`${itemId}-${itemProperty.toString()}`}
            label={translate(findLocalizationKeyForProperty(itemProperty))}
            value={itemProperties[itemProperty]}
            disabled={isDisabled}
          />
        );
      })}
    />
  ) : (
    <SelfCorrectingContent
      selfCorrectingOptions={selfCorrectingOptions}
      selfCorrectingStep={SelfCorrectingAutofillWebcardStep.Options}
      onClickSelfCorrectingCategory={() => ({})}
      onClickSelfCorrectingOption={onClickItemOption}
      isInputPasswordField={!!webcardInfos.srcElement.isInputPassword}
    />
  );
  return (
    <CardLayout isDropdown header={header} webcardData={webcardInfos}>
      {cardContent}
    </CardLayout>
  );
};
