import { useEffect, useState } from "react";
import {
  logCardClick,
  logCardDismissal,
  logCardImpressions,
} from "@braze/web-sdk";
import { Button, Infobox, jsx, Paragraph } from "@dashlane/design-system";
import { DataStatus } from "@dashlane/carbon-api-consumers";
import { openExternalUrl } from "../../../../libs/externalUrls";
import { usePublicUserId } from "../../../../libs/api/session/usePublicUserId";
import { sanitizeURL } from "../../../../libs/browser";
import { getLatestBrazeContentCard } from "./braze-content-card-helpers";
import useTranslate from "../../../../libs/i18n/useTranslate";
const I18N_KEYS = {
  DISMISS_LABEL: "embed_alert_braze_content_card_dismiss",
};
export const BrazeContentCardInfoBox = () => {
  const { translate } = useTranslate();
  const [dismissed, setDismissed] = useState(false);
  const [impressionLogged, setImpressionLogged] = useState(false);
  const publicUserIdQuery = usePublicUserId();
  const publicUserId =
    publicUserIdQuery.status === DataStatus.Success
      ? publicUserIdQuery.data
      : null;
  const latestCard = getLatestBrazeContentCard(publicUserId);
  useEffect(() => {
    if (impressionLogged) {
      return;
    }
    if (latestCard) {
      logCardImpressions([latestCard], true);
      setImpressionLogged(true);
    }
  }, [latestCard, impressionLogged]);
  if (!latestCard) {
    return null;
  }
  const { description, dismissible, linkText, title, url } = latestCard;
  const contentCardClickHandler = () => {
    logCardClick(latestCard, true);
    openExternalUrl(sanitizeURL(url));
  };
  const contentCardDismissHandler = () => {
    logCardDismissal(latestCard);
    latestCard.dismissCard();
    setDismissed(true);
  };
  const actions = [];
  if (dismissible) {
    actions.push(
      <Button
        type="button"
        intensity="quiet"
        size="small"
        mood="brand"
        key="secondary"
        onClick={contentCardDismissHandler}
      >
        {translate(I18N_KEYS.DISMISS_LABEL)}
      </Button>
    );
  }
  if (url) {
    actions.push(
      <Button
        type="button"
        size="small"
        mood="brand"
        key="primary"
        onClick={contentCardClickHandler}
      >
        {linkText}
      </Button>
    );
  }
  return (
    <Infobox
      title={title ? title : description}
      size="large"
      actions={actions}
      description={
        title && description ? <Paragraph>{description}</Paragraph> : null
      }
      mood="brand"
      sx={dismissed ? { display: "none" } : { margin: "8px" }}
    />
  );
};
