import * as React from "react";
import {
  AutofillDropdownWebcardConfiguration,
  AutofillDropdownWebcardData,
  DisableDashlaneOnFieldOption,
} from "@dashlane/autofill-engine/types";
import {
  AnonymousAutofillSettingEvent,
  AutofillConfiguration,
  AutofillDurationSetting,
  AutofillScope,
  BrowseComponent,
  DomainType,
  hashDomain,
  PageView,
  UserAutofillSettingEvent,
} from "@dashlane/hermes";
import { useCommunication } from "../../../../context/communication";
import { I18nContext } from "../../../../context/i18n";
import { CardLayout } from "../../../common/layout/CardLayout";
import { Header } from "../../../common/layout/Header";
import { HeaderTitle } from "../../../common/layout/HeaderTitle";
import { DropdownOptionsList } from "./DropdownOptionsList";
import { SelfCorrectingMenu } from "./SelfCorrectingMenu";
const I18N_KEYS = {
  OPTIONS_TITLE: "optionsTitle",
};
export interface OptionsMenuProps {
  closeWebcard: () => void;
  onMoreOptions: () => void;
  webcardData: AutofillDropdownWebcardData;
}
export const OptionsMenu = ({
  onMoreOptions,
  closeWebcard,
  webcardData,
}: OptionsMenuProps) => {
  const { translate } = React.useContext(I18nContext);
  const { autofillEngineCommands } = useCommunication();
  const [showSelfCorrectingMenu, setShowSelfCorrectingMenu] =
    React.useState(false);
  const { tabRootDomain } = webcardData;
  React.useEffect(() => {
    autofillEngineCommands?.logPageView({
      pageView: PageView.AutofillDropdownSettings,
      browseComponent: BrowseComponent.Webcard,
    });
  }, [autofillEngineCommands]);
  const onCloseOption = async () => {
    autofillEngineCommands?.logEvent(
      new UserAutofillSettingEvent({
        disableSetting: {
          scope: AutofillScope.Field,
          configuration: AutofillConfiguration.AutofillDisabled,
          duration_setting: AutofillDurationSetting.OnceForThisVisit,
        },
        isBulk: false,
      })
    );
    autofillEngineCommands?.logEvent(
      new AnonymousAutofillSettingEvent({
        isNativeApp: false,
        domain: {
          type: DomainType.Web,
          id: await hashDomain(tabRootDomain ?? ""),
        },
        disableSetting: {
          scope: AutofillScope.Field,
          configuration: AutofillConfiguration.AutofillDisabled,
          duration_setting: AutofillDurationSetting.OnceForThisVisit,
        },
      })
    );
    autofillEngineCommands?.disableDashlaneOnField(
      webcardData,
      DisableDashlaneOnFieldOption.TemporarilyDisable
    );
    closeWebcard();
  };
  const onNeverSuggestOption = async () => {
    autofillEngineCommands?.logEvent(
      new UserAutofillSettingEvent({
        disableSetting: {
          scope: AutofillScope.Field,
          configuration: AutofillConfiguration.AutofillDisabled,
          duration_setting: AutofillDurationSetting.UntilTurnedBackOn,
        },
        isBulk: false,
      })
    );
    autofillEngineCommands?.logEvent(
      new AnonymousAutofillSettingEvent({
        isNativeApp: false,
        domain: {
          type: DomainType.Web,
          id: await hashDomain(tabRootDomain ?? ""),
        },
        disableSetting: {
          scope: AutofillScope.Field,
          configuration: AutofillConfiguration.AutofillDisabled,
          duration_setting: AutofillDurationSetting.UntilTurnedBackOn,
        },
      })
    );
    autofillEngineCommands?.disableDashlaneOnField(
      webcardData,
      DisableDashlaneOnFieldOption.PermanentlyDisable
    );
  };
  const onSelfCorrectOption = () => setShowSelfCorrectingMenu(true);
  if (showSelfCorrectingMenu) {
    return (
      <SelfCorrectingMenu
        data={webcardData}
        closeWebcard={closeWebcard}
        onMoreOptions={onMoreOptions}
      />
    );
  }
  return (
    <CardLayout
      header={
        <Header
          isDropdown={true}
          isOptionsMenuOpen={true}
          onClickOptions={onMoreOptions}
          withDashlaneLogo={true}
        >
          <HeaderTitle title={translate(I18N_KEYS.OPTIONS_TITLE)} />
        </Header>
      }
      isDropdown
      webcardData={webcardData}
      withNoMainPadding
      withNoContentCardWrapper
    >
      <DropdownOptionsList
        onCloseOption={onCloseOption}
        onNeverSuggestOption={onNeverSuggestOption}
        onSelfCorrectOption={onSelfCorrectOption}
        showSelfCorrectingOption={
          webcardData.configuration !==
          AutofillDropdownWebcardConfiguration.SelfCorrecting
        }
      />
    </CardLayout>
  );
};
