import { Icon, jsx } from "@dashlane/design-system";
import { Button, ClickOrigin, UserClickEvent } from "@dashlane/hermes";
import { useSubscriptionCode } from "../../../../libs/api";
import {
  GET_PREMIUM_URL,
  openExternalUrl,
} from "../../../../libs/externalUrls";
import useTranslate from "../../../../libs/i18n/useTranslate";
import { useShowB2CFrozenState } from "../../../../libs/hooks/use-show-b2c-frozen-state";
import { MoreToolsListItemClickable } from "../more-tools-list-item/more-tools-list-item-clickable";
import { logEvent } from "../../../../libs/logs/logEvent";
const I18N_KEYS = {
  TITLE: "more_tools/frozen/frozen_title",
  EXPLANATION: "more_tools/frozen/frozen_explanation",
};
export const B2CFrozenItem = () => {
  const showItem = useShowB2CFrozenState();
  const { translate } = useTranslate();
  const subscriptionCode = useSubscriptionCode();
  if (showItem.isLoading || !showItem.showB2CFrozenBanner) {
    return null;
  }
  const buyDashlaneLink = `${GET_PREMIUM_URL}?subCode=${
    subscriptionCode ?? ""
  }`;
  const handleBuyDashlane = () => {
    void logEvent(
      new UserClickEvent({
        button: Button.UnfreezeAccount,
        clickOrigin: ClickOrigin.BannerFrozenAccount,
      })
    );
    void openExternalUrl(buyDashlaneLink);
  };
  return (
    <MoreToolsListItemClickable
      icon={<Icon name="FeedbackFailOutlined" color="ds.text.neutral.catchy" />}
      onClick={handleBuyDashlane}
      title={translate(I18N_KEYS.TITLE)}
      explanation={translate(I18N_KEYS.EXPLANATION)}
      isWarning={true}
    />
  );
};
