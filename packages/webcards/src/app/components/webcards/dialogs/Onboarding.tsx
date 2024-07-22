import * as React from "react";
import {
  AnonymousAutofillDismissEvent,
  BrowseComponent,
  DismissType,
  DomainType,
  hashDomain,
  PageView,
  UserAutofillDismissEvent,
} from "@dashlane/hermes";
import {
  OnboardingNotificationConfiguration,
  OnboardingNotificationWebcardData,
} from "@dashlane/autofill-engine/dist/autofill-engine/src/types";
import { I18nContext } from "../../../context/i18n";
import { useCommunication } from "../../../context/communication";
import { KEYBOARD_EVENTS } from "../../../constants";
import { SecondaryActionButton } from "../../common/generic/buttons/SecondaryActionButton";
import { PrimaryActionButton } from "../../common/generic/buttons/PrimaryActionButton";
import { DialogContainer } from "../../common/layout/DialogContainer";
import { HeaderTitle } from "../../common/layout/HeaderTitle";
import { WebcardPropsBase } from "../config";
import styles from "./Onboarding.module.scss";
interface Props extends WebcardPropsBase {
  data: OnboardingNotificationWebcardData;
}
export const Onboarding = ({
  data: { configuration, tabRootDomain },
  closeWebcard,
}: Props) => {
  const { translate } = React.useContext(I18nContext);
  const { autofillEngineCommands } = useCommunication();
  React.useEffect(() => {
    autofillEngineCommands?.logPageView({
      pageView:
        configuration === OnboardingNotificationConfiguration.AfterLogin
          ? PageView.AutofillNotificationOnboardingDashlanePro
          : configuration === OnboardingNotificationConfiguration.AfterSave
          ? PageView.AutofillNotificationOnboardingFirstPasswordSaved
          : PageView.AutofillNotificationOnboardingTryAgainOrGoApp,
      browseComponent: BrowseComponent.Webcard,
    });
  }, [autofillEngineCommands, configuration]);
  const onCancel = async ({ withEscapeKey = false } = {}) => {
    autofillEngineCommands?.logEvent(
      new UserAutofillDismissEvent({
        dismissType: withEscapeKey
          ? DismissType.CloseEscape
          : DismissType.Cancel,
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
          : DismissType.Cancel,
      })
    );
    closeWebcard();
  };
  React.useEffect(() => {
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === KEYBOARD_EVENTS.ESCAPE) {
        onCancel({ withEscapeKey: true });
      }
    };
    window.addEventListener("keyup", closeOnEscape);
    return () => window.removeEventListener("keyup", closeOnEscape);
  }, []);
  const onConfirm = async () => {
    autofillEngineCommands?.openWebapp({
      route:
        configuration === OnboardingNotificationConfiguration.AfterSave
          ? "/passwords"
          : "/getting-started",
    });
    closeWebcard();
  };
  return (
    <DialogContainer
      closeWebcard={onCancel}
      headerContent={<HeaderTitle title={translate(`${configuration}Title`)} />}
      withHeaderLogo
      withHeaderCloseButton
    >
      <div className={styles.buttonsContainer}>
        {configuration === OnboardingNotificationConfiguration.AfterCancel ? (
          <SecondaryActionButton
            onClick={onCancel}
            label={translate(`${configuration}Cancel`)}
          />
        ) : null}
        <PrimaryActionButton
          onClick={onConfirm}
          label={translate(`${configuration}Confirm`)}
        />
      </div>
    </DialogContainer>
  );
};
