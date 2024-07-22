import { useContext, useEffect } from "react";
import {
  PhishingPreventionWebcardData,
  vaultSourceTypeToHermesItemTypeMap,
} from "@dashlane/autofill-engine/dist/autofill-engine/src/types";
import {
  Button,
  Icon,
  jsx,
  mergeSx,
  ThemeUIStyleObject,
} from "@dashlane/design-system";
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
interface Props extends WebcardPropsBase {
  data: PhishingPreventionWebcardData;
}
const SX_STYLES: Record<string, Partial<ThemeUIStyleObject>> = {
  BUTTONS_CONTAINER: {
    display: "flex",
    width: "100%",
    justifyContent: "flex-end",
    button: {
      marginRight: "8px",
      fontSize: "16px",
      height: "40px",
      borderRadius: "3px",
    },
  },
  CONTAINER: {
    display: "flex",
    flexDirection: "column",
    padding: "0px 24px",
  },
  FIELD: {
    height: "40px",
    marginBottom: "12px",
    fontWeight: "400",
    fontSize: "16px",
    lineHeight: "20px",
    color: "ds.text.neutral.catchy",
    textIndent: "12px",
    border: "0px",
    borderRadius: "4px",
  },
  FOOTER: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
  },
  LABEL: {
    fontWeight: "600",
    fontSize: "10px",
    margin: "6px 0px",
    span: {
      display: "flex",
      flexDirection: "row",
      alignItems: "flex-end",
    },
    textTransform: "uppercase",
  },
  LINK: {
    backgroundColor: "transparent",
    marginLeft: "8px",
    fontSize: "14px",
    "&:hover": {
      textDecoration: "underline",
      cursor: "pointer",
    },
  },
  MORE_INFO: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    marginTop: "12px",
    button: {
      borderRadius: "3px",
    },
  },
};
const I18N_KEYS = {
  title: "headerTitle",
  trustedUrl: "trustedUrlLabel",
  currentUrl: "currentUrlLabel",
  phishingInfo: "phishingCTALink",
  cancel: "cancelButton",
  ok: "okButton",
};
const PHISHING_BLOG_ARTICLE_URL = "*****";
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
    <div sx={SX_STYLES.FOOTER}>
      <div sx={SX_STYLES.BUTTONS_CONTAINER}>
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
      </div>
    </div>
  );
  const headerContent = <span>{translate(I18N_KEYS.title)}</span>;
  return (
    <DialogContainer
      closeWebcard={handleCloseWebcard}
      headerContent={headerContent}
      footerContent={footerContent}
      withHeaderLogo
      withHeaderCloseButton
    >
      <div sx={SX_STYLES.CONTAINER}>
        <label
          htmlFor="trustedUrlInput"
          sx={mergeSx([SX_STYLES.LABEL, { color: "ds.text.neutral.quiet" }])}
        >
          <span>
            {translate(I18N_KEYS.trustedUrl)}
            <Icon
              name="LockFilled"
              size="xsmall"
              sx={{
                width: "10px",
                marginLeft: "5px",
                color: "ds.text.neutral.standard",
              }}
            />
          </span>
        </label>
        <input
          type="text"
          id="trustedUrlInput"
          value={data.urlOfCopiedItem}
          disabled
          sx={mergeSx([
            SX_STYLES.FIELD,
            {
              backgroundColor: "ds.container.expressive.positive.quiet.idle",
            },
          ])}
        />
        <label
          htmlFor="currentUrlInput"
          sx={mergeSx([SX_STYLES.LABEL, { color: "ds.text.warning.quiet" }])}
        >
          {translate(I18N_KEYS.currentUrl)}
        </label>
        <input
          type="text"
          id="currentUrlInput"
          value={data.urlOfPasteDestination}
          disabled
          sx={mergeSx([
            SX_STYLES.FIELD,
            {
              backgroundColor: "ds.container.expressive.warning.quiet.idle",
            },
          ])}
        />
        <div sx={SX_STYLES.MORE_INFO}>
          <Button
            role="link"
            layout="iconOnly"
            mood="neutral"
            intensity="quiet"
            size="small"
            aria-label={translate(I18N_KEYS.phishingInfo)}
            icon={<Icon name="FeedbackInfoOutlined" />}
            onClick={handleClickMoreInfo}
          ></Button>
          <button
            role="link"
            aria-label={translate(I18N_KEYS.phishingInfo)}
            onClick={handleClickMoreInfo}
            sx={SX_STYLES.LINK}
          >
            {translate(I18N_KEYS.phishingInfo)}
          </button>
        </div>
      </div>
    </DialogContainer>
  );
};
