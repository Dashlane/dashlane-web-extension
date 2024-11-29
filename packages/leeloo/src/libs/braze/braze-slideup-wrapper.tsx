import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { InAppMessage, SlideUpMessage } from "@braze/web-sdk";
import { useToast } from "@dashlane/design-system";
import { openUrl } from "../external-urls";
import useTranslate from "../i18n/useTranslate";
import { useHistory } from "../router";
import { DEEPLINK_SCHEME, isDeeplink } from "./braze-cta-helpers";
interface Props {
  inAppMessage: SlideUpMessage;
  logBodyClick: (inAppMessage: SlideUpMessage) => void;
  logImpression: (inAppMessage: SlideUpMessage) => void;
  flushBrazeData: Dispatch<SetStateAction<boolean>>;
}
const BRAZE_EXTRAS_KEY_FOR_I18N = "action-loc-key";
const BRAZE_EXTRAS_BUTTON_AS_TEXT = "close-as-text";
const CTA_VARIANT_KEYS = [
  "braze_slideup_cta_variant_activate",
  "braze_slideup_cta_variant_go",
  "braze_slideup_cta_variant_ok",
];
const I18N_KEYS = {
  CLOSE_LABEL: "braze_slideup_close_label",
  DEFAULT_CTA_TEXT: "braze_slideup_default_cta",
};
export const BrazeSlideupWrapper = ({
  inAppMessage,
  logBodyClick,
  logImpression,
  flushBrazeData,
}: Props) => {
  const { closeToast, showToast } = useToast();
  const { message, clickAction, extras, dismissType } = inAppMessage;
  const { translate } = useTranslate();
  const history = useHistory();
  const [redirectPath, setRedirectPath] = useState("");
  useEffect(() => {
    if (redirectPath) {
      flushBrazeData(true);
      history.push(redirectPath);
    }
  }, [redirectPath]);
  useEffect(() => {
    let toastId: string;
    if (message) {
      const isTranslationKeyProvided = Boolean(
        extras[BRAZE_EXTRAS_KEY_FOR_I18N]
      );
      const isTranslationKeyValid =
        isTranslationKeyProvided &&
        CTA_VARIANT_KEYS.includes(extras[BRAZE_EXTRAS_KEY_FOR_I18N]);
      const handleAction = (id: string) => {
        const { uri } = inAppMessage;
        closeToast(id);
        if (uri) {
          if (isDeeplink(uri)) {
            setRedirectPath(uri.substring(DEEPLINK_SCHEME.length - 1));
          } else {
            openUrl(uri);
          }
        }
        logBodyClick(inAppMessage);
      };
      const toastAction =
        clickAction === InAppMessage.ClickAction.URI && isTranslationKeyProvided
          ? {
              label: isTranslationKeyValid
                ? translate(extras[BRAZE_EXTRAS_KEY_FOR_I18N])
                : translate(I18N_KEYS.DEFAULT_CTA_TEXT),
              onClick: handleAction,
            }
          : undefined;
      toastId = showToast({
        description: message,
        closeActionLabel: translate(I18N_KEYS.CLOSE_LABEL),
        isManualDismiss: dismissType === InAppMessage.DismissType.MANUAL,
        action: toastAction,
        showCloseActionAsText: Boolean(extras[BRAZE_EXTRAS_BUTTON_AS_TEXT]),
      });
      logImpression(inAppMessage);
    }
    return () => {
      if (toastId) {
        closeToast(toastId);
      }
    };
  }, []);
  return null;
};
