import * as React from "react";
import {
  AutofillDropdownWebcardConfiguration,
  AutofillDropdownWebcardData,
  AutofillDropdownWebcardWarningType,
  DisableDashlaneOnFieldOption,
  vaultSourceTypeToHermesItemTypeMap,
} from "@dashlane/autofill-engine/dist/autofill-engine/src/types";
import {
  AnonymousAutofillCorrectEvent,
  AnonymousRightClickMenuActionEvent,
  BrowseComponent,
  CorrectionType,
  DomainType,
  hashDomain,
  ItemType,
  PageView,
  RightClickMenuFlowStep,
  UserAutofillCorrectEvent,
  UserRightClickMenuActionEvent,
} from "@dashlane/hermes";
import { Icon } from "@dashlane/design-system";
import { I18nContext } from "../../../../context/i18n";
import { useCommunication } from "../../../../context/communication";
import { CardLayout } from "../../../common/layout/CardLayout";
import { DropdownContainer } from "../../../common/layout/DropdownContainer";
import { Footer } from "../../../common/layout/Footer";
import { HeaderTitle } from "../../../common/layout/HeaderTitle";
import { Header } from "../../../common/layout/Header";
import { AutofillFooter } from "../AutofillFooter";
import { SelfCorrectingContent } from "./SelfCorrectingContent";
import {
  FIRST_STEP_CARDS,
  OtherCategory,
  SECOND_STEP_CARDS,
  SelfCorrectingAutofillCategoryItem,
  SelfCorrectingAutofillOptionItem,
  SelfCorrectingAutofillWebcardStep,
  SOURCE_TYPE_TO_LOCALIZATION_KEY,
} from "./SelfCorrectingTree";
import styles from "./SelfCorrectingMenu.module.scss";
interface Props {
  closeWebcard: () => void;
  data: AutofillDropdownWebcardData;
  onMoreOptions?: () => void;
}
export const SelfCorrectingMenu = ({
  closeWebcard,
  data,
  onMoreOptions,
}: Props) => {
  const { translate } = React.useContext(I18nContext);
  const { autofillEngineCommands } = useCommunication();
  const {
    tabRootDomain,
    srcElement,
    fieldType,
    warningType,
    context,
    configuration,
  } = data;
  const [selfCorrectingStep, setSelfCorrectingStep] = React.useState(
    SelfCorrectingAutofillWebcardStep.Categories
  );
  const DEFAULT_SELF_CORRECTING_TITLE = translate("fixAutofillHeader");
  const [selfCorrectingOptions, setSelfCorrectingOptions] =
    React.useState(FIRST_STEP_CARDS);
  const [cardTitle, setCardTitle] = React.useState(
    DEFAULT_SELF_CORRECTING_TITLE
  );
  React.useEffect(() => {
    autofillEngineCommands?.logPageView({
      pageView: PageView.AutofillDropdownCorrect,
      browseComponent: BrowseComponent.Webcard,
    });
  }, [autofillEngineCommands]);
  const onBackLinkClick = () => {
    setSelfCorrectingOptions(FIRST_STEP_CARDS);
    setSelfCorrectingStep(SelfCorrectingAutofillWebcardStep.Categories);
    setCardTitle(DEFAULT_SELF_CORRECTING_TITLE);
  };
  const sendLogsOnClickOption = async (
    item: SelfCorrectingAutofillOptionItem
  ) => {
    const initialItemType = fieldType?.reduce((acc: ItemType[], vaultType) => {
      const itemType = vaultSourceTypeToHermesItemTypeMap[vaultType];
      if (itemType) {
        acc.push(itemType);
      }
      return acc;
    }, []);
    const newItemType = vaultSourceTypeToHermesItemTypeMap[item.itemType];
    if (
      configuration === AutofillDropdownWebcardConfiguration.SelfCorrecting &&
      newItemType
    ) {
      const { elementHasImpala } = data;
      autofillEngineCommands?.logEvent(
        new UserRightClickMenuActionEvent({
          fieldInitialClassificationList: initialItemType,
          fieldFilled: newItemType,
          isFieldDetectedByAnalysisEngine: elementHasImpala,
          rightClickMenuFlowStep: RightClickMenuFlowStep.SelectVaultItem,
        })
      );
      autofillEngineCommands?.logEvent(
        new AnonymousRightClickMenuActionEvent({
          domain: {
            type: DomainType.Web,
            id: await hashDomain(tabRootDomain ?? ""),
          },
          fieldInitialClassificationList: initialItemType,
          fieldFilled: newItemType,
          isFieldDetectedByAnalysisEngine: elementHasImpala,
          isNativeApp: false,
          rightClickMenuFlowStep: RightClickMenuFlowStep.SelectVaultItem,
        })
      );
    }
    if (initialItemType?.length && newItemType) {
      autofillEngineCommands?.logEvent(
        new UserAutofillCorrectEvent({
          correctionType: CorrectionType.ChangeClassification,
          fieldCorrected: initialItemType[0],
          initialFieldClassificationList: initialItemType,
          newFieldClassification: newItemType,
        })
      );
      autofillEngineCommands?.logEvent(
        new AnonymousAutofillCorrectEvent({
          domain: {
            type: DomainType.Web,
            id: await hashDomain(tabRootDomain ?? ""),
          },
          isNativeApp: false,
          correctionType: CorrectionType.ChangeClassification,
          fieldCorrected: initialItemType[0],
          initialFieldClassificationList: initialItemType,
          newFieldClassification: newItemType,
        })
      );
    }
  };
  const onClickSelfCorrectingOption = async (
    item: SelfCorrectingAutofillOptionItem
  ) => {
    sendLogsOnClickOption(item);
    autofillEngineCommands?.applySelfCorrectingAutofill(data, {
      dataSource: { [item.itemType]: item.itemProperty },
    });
  };
  const onClickSelfCorrectingCategory = (
    item: SelfCorrectingAutofillCategoryItem
  ) => {
    const secondStepCard = SECOND_STEP_CARDS[item.itemType];
    if (item.itemType === OtherCategory.Nothing) {
      autofillEngineCommands?.disableDashlaneOnField(
        data,
        DisableDashlaneOnFieldOption.PermanentlyDisable
      );
    } else if (secondStepCard) {
      setCardTitle(translate(SOURCE_TYPE_TO_LOCALIZATION_KEY[item.itemType]));
      setSelfCorrectingOptions(secondStepCard);
      setSelfCorrectingStep(SelfCorrectingAutofillWebcardStep.Options);
    }
  };
  const mainContent = (
    <SelfCorrectingContent
      selfCorrectingOptions={selfCorrectingOptions}
      selfCorrectingStep={selfCorrectingStep}
      onClickSelfCorrectingCategory={onClickSelfCorrectingCategory}
      onClickSelfCorrectingOption={onClickSelfCorrectingOption}
      isInputPasswordField={!!srcElement.isInputPassword}
    />
  );
  const headerContent = (
    <div className={styles.header}>
      {selfCorrectingStep === SelfCorrectingAutofillWebcardStep.Options ? (
        <button
          type="button"
          className={styles.backLink}
          onClick={onBackLinkClick}
          data-keyboard-accessible
        >
          <Icon name="CaretLeftOutlined" />
        </button>
      ) : null}
      <HeaderTitle title={cardTitle} />
    </div>
  );
  const footerContent =
    warningType &&
    warningType !==
      AutofillDropdownWebcardWarningType.PossibleDuplicateRegistration ? (
      <AutofillFooter
        context={context}
        warningType={warningType}
        closeWebcard={closeWebcard}
      />
    ) : null;
  const withDashlaneLogo =
    selfCorrectingStep === SelfCorrectingAutofillWebcardStep.Categories;
  const withNoMainPadding = true;
  return data.configuration ===
    AutofillDropdownWebcardConfiguration.SelfCorrecting ? (
    <DropdownContainer
      closeWebcard={closeWebcard}
      footerContent={footerContent}
      headerContent={headerContent}
      webcardData={data}
      withHeaderLogo={withDashlaneLogo}
      withHeaderOptionsButton
      withHeaderSearchButton
      withNoMainPadding={withNoMainPadding}
      withFooterPadding={false}
    >
      {mainContent}
    </DropdownContainer>
  ) : (
    <CardLayout
      header={
        <Header
          isDropdown
          isOptionsMenuOpen
          onClickOptions={onMoreOptions}
          withDashlaneLogo={withDashlaneLogo}
        >
          {headerContent}
        </Header>
      }
      footer={<Footer withFooterPadding={false}>{footerContent}</Footer>}
      isDropdown
      webcardData={data}
      withNoMainPadding={withNoMainPadding}
    >
      {mainContent}
    </CardLayout>
  );
};
