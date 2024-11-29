import { useContext, useEffect } from "react";
import {
  PhishingPreventionWebcardData,
  vaultSourceTypeToHermesItemTypeMap,
} from "@dashlane/autofill-engine/types";
import { Flex, jsx, LinkButton, TextField } from "@dashlane/design-system";
import {
  AnonymousAutofillAcceptEvent,
  AnonymousAutofillSuggestEvent,
  AutofillButton,
  AutofillMessageType,
  BrowseComponent,
  DismissType,
  DomainType,
  hashDomain,
  PageView,
  UserAutofillAcceptEvent,
  UserAutofillClickEvent,
  UserAutofillSuggestEvent,
  WebcardSaveOptions,
} from "@dashlane/hermes";
import { VaultSourceType } from "@dashlane/autofill-contracts";
import { WebcardPropsBase } from "../config";
import { DialogContainer } from "../../common/layout/DialogContainer";
import { KEYBOARD_EVENTS } from "../../../constants";
import { useCommunication } from "../../../context/communication";
import { I18nContext } from "../../../context/i18n";
import { usePerformanceContext } from "../../../context/performance";
import { SecondaryActionButton } from "../../../components/common/generic/buttons/SecondaryActionButton";
import { PrimaryActionButton } from "../../../components/common/generic/buttons/PrimaryActionButton";
import { IS_NATIVE_APP } from "../../../utils/logs";
import { HeaderTitle } from "../../../components/common/layout/HeaderTitle";
interface Props extends WebcardPropsBase {
  data: PhishingPreventionWebcardData;
}
const I18N_KEYS = {
  title: "headerTitle",
  trustedUrl: "trustedUrlLabel",
  currentUrl: "currentUrlLabel",
  phishingInfo: "phishingCTALink",
  cancel: "cancelButton",
  ok: "okButton",
};
const PHISHING_BLOG_ARTICLE_URL = "__REDACTED__";
export const PhishingPreventionPrompt = ({ data, closeWebcard }: Props) => {
  const { autofillEngineCommands } = useCommunication();
  const { translate } = useContext(I18nContext);
  const timeToWebcard = usePerformanceContext();
  const {
    isRestoredWebcard,
    urlOfCopiedItem,
    urlOfPasteDestination,
    metadata,
  } = data;
  useEffect(() => {
    if (!timeToWebcard) {
      return;
    }
    autofillEngineCommands?.logPageView({
      pageView: PageView.AutofillNotificationPhishingPrevention,
      browseComponent: BrowseComponent.Webcard,
    });
    const autofillMessageTypeList = [AutofillMessageType.PotentialPhishingRisk];
    autofillEngineCommands?.logEvent(
      new UserAutofillSuggestEvent({
        isNativeApp: IS_NATIVE_APP,
        msToWebcard: timeToWebcard,
        autofillMessageTypeList,
        isRestoredWebcard,
      })
    );
    (async () => {
      autofillEngineCommands?.logEvent(
        new AnonymousAutofillSuggestEvent({
          isNativeApp: IS_NATIVE_APP,
          msToWebcard: timeToWebcard,
          autofillMessageTypeList,
          domain: {
            type: DomainType.Web,
            id: await hashDomain(urlOfPasteDestination ?? ""),
          },
        })
      );
    })();
  }, [
    autofillEngineCommands,
    timeToWebcard,
    isRestoredWebcard,
    urlOfPasteDestination,
  ]);
  useEffect(() => {
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === KEYBOARD_EVENTS.ESCAPE) {
        closeWebcard(DismissType.CloseEscape);
      }
    };
    window.addEventListener("keyup", closeOnEscape);
    return () => window.removeEventListener("keyup", closeOnEscape);
  }, []);
  const handleAcceptPaste = async () => {
    autofillEngineCommands?.signalPasteDecision(
      {
        allowedByUser: true,
        urlOfCopiedItem,
        urlOfPasteDestination,
      },
      metadata
    );
    closeWebcard();
    const itemType =
      vaultSourceTypeToHermesItemTypeMap[VaultSourceType.Credential];
    const dataTypeList = itemType ? [itemType] : [];
    const webcardOptionSelected = WebcardSaveOptions.TrustAndPaste;
    autofillEngineCommands?.logEvent(
      new UserAutofillAcceptEvent({
        dataTypeList,
        webcardOptionSelected,
      })
    );
    autofillEngineCommands?.logEvent(
      new AnonymousAutofillAcceptEvent({
        webcardOptionSelected,
        domain: {
          type: DomainType.Web,
          id: await hashDomain(urlOfPasteDestination ?? ""),
        },
      })
    );
  };
  const handleCancelPaste = async () => {
    autofillEngineCommands?.signalPasteDecision(
      {
        allowedByUser: false,
        urlOfCopiedItem,
        urlOfPasteDestination,
      },
      metadata
    );
    closeWebcard(DismissType.DoNotTrust);
  };
  const handleClickMoreInfo = () => {
    autofillEngineCommands?.openNewTabWithUrl(PHISHING_BLOG_ARTICLE_URL);
    autofillEngineCommands?.logEvent(
      new UserAutofillClickEvent({
        autofillButton: AutofillButton.LearnMoreAboutPhishing,
      })
    );
  };
  const handleCloseWebcard = () => {
    autofillEngineCommands?.signalPasteDecision(
      {
        allowedByUser: false,
        urlOfCopiedItem,
        urlOfPasteDestination,
      },
      metadata
    );
    closeWebcard();
  };
  const footerContent = (
    <Flex justifyContent="flex-end" alignItems="center" gap="8px">
      <SecondaryActionButton
        onClick={handleAcceptPaste}
        label={translate(I18N_KEYS.ok)}
        aria-label={translate(I18N_KEYS.ok)}
      />
      <PrimaryActionButton
        onClick={handleCancelPaste}
        label={translate(I18N_KEYS.cancel)}
        aria-label={translate(I18N_KEYS.cancel)}
      />
    </Flex>
  );
  const headerContent = <HeaderTitle title={translate(I18N_KEYS.title)} />;
  return (
    <DialogContainer
      closeWebcard={handleCloseWebcard}
      headerContent={headerContent}
      footerContent={footerContent}
      withHeaderLogo
      withHeaderCloseButton
    >
      <Flex flexDirection="column" gap="8px">
        <TextField
          id="trustedUrlInput"
          label={translate(I18N_KEYS.trustedUrl)}
          value={data.urlOfCopiedItem}
          readOnly
          sx={{
            "& label": {
              color: "ds.text.brand.quiet",
            },
          }}
        />
        <TextField
          id="currentUrlInput"
          label={translate(I18N_KEYS.currentUrl)}
          value={data.urlOfPasteDestination}
          readOnly
          sx={{
            "& label": {
              color: "ds.text.warning.quiet",
            },
          }}
        />
        <LinkButton
          onClick={handleClickMoreInfo}
          role="link"
          sx={{ ml: "8px" }}
        >
          {translate(I18N_KEYS.phishingInfo)}
        </LinkButton>
      </Flex>
    </DialogContainer>
  );
};
