import * as React from "react";
import { Button } from "@dashlane/design-system";
import { ReactivationWebcardData } from "@dashlane/autofill-engine/dist/autofill-engine/src/types";
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
import styles from "./Reactivation.module.scss";
const I18N_KEYS = {
  DONT_ASK_AGAIN: "mavReactivationDismiss",
  LOGIN: "mavReactivationBtn",
  REACTIVATION_TITLE: "mavReactivationTitle",
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
    autofillEngineCommands?.openWebapp({});
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
      headerContent={
        <HeaderTitle title={translate(I18N_KEYS.REACTIVATION_TITLE)} />
      }
      webcardData={data}
      withHeaderCloseButton
      withHeaderLogo
    >
      <div className={styles.main}>
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
      </div>
    </DropdownContainer>
  );
};
