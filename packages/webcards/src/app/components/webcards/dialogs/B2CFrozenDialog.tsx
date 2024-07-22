import { Fragment, useCallback, useContext, useEffect } from "react";
import { Button, ClickOrigin, UserClickEvent } from "@dashlane/hermes";
import { Infobox, jsx } from "@dashlane/design-system";
import { B2CFrozenDialogWebcardData } from "@dashlane/autofill-engine/dist/autofill-engine/src/Api/types/webcards/b2c-frozen-dialog-webcard";
import { VaultSourceType } from "@dashlane/autofill-contracts";
import { I18nContext } from "../../../context/i18n";
import { useCommunication } from "../../../context/communication";
import { KEYBOARD_EVENTS } from "../../../constants";
import { vaultSourceTypeToWebappRouteNameMap } from "../../../utils/routes/routes";
import { SecondaryActionButton } from "../../common/generic/buttons/SecondaryActionButton";
import { PrimaryActionButton } from "../../common/generic/buttons/PrimaryActionButton";
import { DialogContainer } from "../../common/layout/DialogContainer";
import { HeaderTitle } from "../../common/layout/HeaderTitle";
import { WebcardPropsBase } from "../config";
const I18N_KEYS = {
  HEADER_TITLE: "headerTitle",
  INFOBOX_TITLE: "infoboxTitle",
  INFOBOX_DESCRIPTION: "infoboxDescription",
  BUTTON_BUY: "buttonBuy",
  BUTTON_CANCEL: "buttonCancel",
};
const SX_STYLES = {
  DOMAIN: {
    fontSize: "10px",
    textTransform: "uppercase" as const,
    color: "ds.text.brand.standard.quiet",
    letterSpacing: "0.2px",
    lineHeight: "100%",
    fontWeight: "500",
  },
  BUTTONS: {
    margin: "12px 12px 0px 12px",
    display: "flex",
    justifyContent: "end",
    gap: "8px",
  },
  INFOBOX: {
    margin: "0px 12px",
  },
};
interface Props extends WebcardPropsBase {
  data: B2CFrozenDialogWebcardData;
}
export const B2CFrozenDialog = ({ data, closeWebcard }: Props) => {
  const { translate } = useContext(I18nContext);
  const { savePasswordDisplayUrl, passwordLimit } = data;
  const { autofillEngineCommands } = useCommunication();
  const onCancel = useCallback(
    ({ withEscapeKey = false } = {}) => {
      closeWebcard();
    },
    [closeWebcard]
  );
  const onClickBuy = () => {
    autofillEngineCommands?.logEvent(
      new UserClickEvent({
        button: Button.UnfreezeAccount,
        clickOrigin: ClickOrigin.SavePasswordNotificationWebcard,
      })
    );
    autofillEngineCommands?.openWebapp({
      route: vaultSourceTypeToWebappRouteNameMap[VaultSourceType.Credential],
      query: { b2cFrozen: "true" },
    });
  };
  useEffect(() => {
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === KEYBOARD_EVENTS.ESCAPE) {
        onCancel({ withEscapeKey: true });
      }
    };
    window.addEventListener("keyup", closeOnEscape);
    return () => window.removeEventListener("keyup", closeOnEscape);
  }, [onCancel]);
  return (
    <DialogContainer
      closeWebcard={onCancel}
      headerContent={
        <>
          {<p sx={SX_STYLES.DOMAIN}>{savePasswordDisplayUrl}</p>}
          <HeaderTitle title={translate(I18N_KEYS.HEADER_TITLE)} />
        </>
      }
      withHeaderLogo
      withHeaderCloseButton
    >
      <Infobox
        title={translate(I18N_KEYS.INFOBOX_TITLE)}
        mood="danger"
        icon="FeedbackFailOutlined"
        description={translate(I18N_KEYS.INFOBOX_DESCRIPTION, {
          count: passwordLimit,
        })}
        sx={SX_STYLES.INFOBOX}
      />
      <div sx={SX_STYLES.BUTTONS}>
        <SecondaryActionButton
          onClick={onCancel}
          label={translate(I18N_KEYS.BUTTON_CANCEL)}
        />
        <PrimaryActionButton
          onClick={onClickBuy}
          label={translate(I18N_KEYS.BUTTON_BUY)}
        />
      </div>
    </DialogContainer>
  );
};
