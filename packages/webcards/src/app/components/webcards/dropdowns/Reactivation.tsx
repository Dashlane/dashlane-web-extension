import * as React from "react";
import { Button, Flex, Paragraph } from "@dashlane/design-system";
import { ReactivationWebcardData } from "@dashlane/autofill-engine/types";
import {
  AnonymousAutofillAcceptEvent,
  BrowseComponent,
  DomainType,
  hashDomain,
  PageView,
  UserAutofillAcceptEvent,
} from "@dashlane/hermes";
import { I18nContext } from "../../../context/i18n";
import { useCommunication } from "../../../context/communication";
import { DropdownContainer } from "../../common/layout/DropdownContainer";
import { HeaderTitle } from "../../common/layout/HeaderTitle";
import { WebcardPropsBase } from "../config";
const I18N_KEYS = {
  DONT_ASK_AGAIN: "mavReactivationDismiss",
  LOGIN: "mavReactivationBtn",
  TITLE: "webAuthnReactivationHeader",
};
interface Props extends WebcardPropsBase {
  data: ReactivationWebcardData;
}
export const Reactivation = ({ closeWebcard, data }: Props) => {
  const { translate } = React.useContext(I18nContext);
  const { autofillEngineCommands } = useCommunication();
  const { extensionShortcuts, tabRootDomain } = data;
  React.useEffect(() => {
    autofillEngineCommands?.logPageView({
      pageView: PageView.AutofillDropdownReactivationLoginOnly,
      browseComponent: BrowseComponent.Webcard,
    });
  }, [autofillEngineCommands]);
  const onLogin = async () => {
    autofillEngineCommands?.logEvent(
      new UserAutofillAcceptEvent({
        dataTypeList: [],
      })
    );
    autofillEngineCommands?.logEvent(
      new AnonymousAutofillAcceptEvent({
        domain: {
          type: DomainType.Web,
          id: await hashDomain(tabRootDomain ?? ""),
        },
      })
    );
    autofillEngineCommands?.openPopup({});
    closeWebcard();
  };
  const onNeverAgain = () => {
    autofillEngineCommands?.disableReactivationWebcards();
    closeWebcard();
  };
  return (
    <DropdownContainer
      closeWebcard={closeWebcard}
      extensionShortcuts={extensionShortcuts}
      headerContent={<HeaderTitle title={translate(I18N_KEYS.TITLE)} />}
      webcardData={data}
      withHeaderCloseButton
      withHeaderLogo
    >
      <Flex flexDirection="column" gap="8px">
        <Button
          type="button"
          mood="brand"
          intensity="catchy"
          fullsize={true}
          onClick={onLogin}
          size="small"
        >
          {translate(I18N_KEYS.LOGIN)}
        </Button>
        <Button
          type="button"
          mood="neutral"
          intensity="quiet"
          fullsize={true}
          onClick={onNeverAgain}
          size="small"
        >
          {translate(I18N_KEYS.DONT_ASK_AGAIN)}
        </Button>
      </Flex>
    </DropdownContainer>
  );
};
