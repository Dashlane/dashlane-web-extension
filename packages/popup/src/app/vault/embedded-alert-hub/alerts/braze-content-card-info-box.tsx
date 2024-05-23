import { useEffect, useState } from 'react';
import * as braze from '@braze/web-sdk';
import { Button, InfoBox, jsx } from '@dashlane/ui-components';
import { DataStatus } from '@dashlane/carbon-api-consumers';
import { openExternalUrl } from 'src/libs/externalUrls';
import { usePublicUserId } from 'src/libs/api/session/usePublicUserId';
import { sanitizeURL } from 'src/libs/browser';
import { getLatestBrazeContentCard } from './braze-content-card-helpers';
import useTranslate from 'src/libs/i18n/useTranslate';
const I18N_KEYS = {
    DISMISS_LABEL: 'embed_alert_braze_content_card_dismiss',
};
export const BrazeContentCardInfoBox = () => {
    const { translate } = useTranslate();
    const [dismissed, setDismissed] = useState(false);
    const [impressionLogged, setImpressionLogged] = useState(false);
    const publicUserIdQuery = usePublicUserId();
    const publicUserId = publicUserIdQuery.status === DataStatus.Success
        ? publicUserIdQuery.data
        : null;
    const latestCard = getLatestBrazeContentCard(publicUserId);
    useEffect(() => {
        if (impressionLogged) {
            return;
        }
        if (latestCard) {
            braze.logCardImpressions([latestCard], true);
            setImpressionLogged(true);
        }
    }, [latestCard, impressionLogged]);
    if (!latestCard) {
        return null;
    }
    const { description, dismissible, linkText, title, url } = latestCard;
    const contentCardClickHandler = () => {
        braze.logCardClick(latestCard, true);
        openExternalUrl(sanitizeURL(url));
    };
    const contentCardDismissHandler = () => {
        braze.logCardDismissal(latestCard);
        latestCard.dismissCard();
        setDismissed(true);
    };
    const actions = [];
    if (dismissible) {
        actions.push(<Button type="button" nature="secondary" key="secondary" onClick={contentCardDismissHandler}>
        {translate(I18N_KEYS.DISMISS_LABEL)}
      </Button>);
    }
    if (url) {
        actions.push(<Button type="button" nature="primary" key="primary" onClick={contentCardClickHandler}>
        {linkText}
      </Button>);
    }
    return (<InfoBox size="descriptive" title={title ? title : description} actions={actions} sx={dismissed
            ? {
                display: 'none',
            }
            : {
                m: '8px',
            }}>
      {title && description ? <p>{description}</p> : null}
    </InfoBox>);
};
