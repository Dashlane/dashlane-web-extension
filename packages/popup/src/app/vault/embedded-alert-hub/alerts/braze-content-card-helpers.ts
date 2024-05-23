import * as braze from '@braze/web-sdk';
function handleCharCountErrors(title: string, description: string) {
    const MAX_CHAR_COUNT = 180;
    const isTitleTooLong = title.length > MAX_CHAR_COUNT;
    const isDescriptionTooLong = description.length > MAX_CHAR_COUNT;
    if (isTitleTooLong || isDescriptionTooLong) {
        throw new Error(`ClassicCard property ${isTitleTooLong
            ? `title (char count: ${title.length})`
            : `description (char count: ${description.length})`} is too long. Max char count of ${MAX_CHAR_COUNT}.`);
    }
}
export function getLatestBrazeContentCard(publicUserId: string | null) {
    if (!publicUserId) {
        return null;
    }
    try {
        const brazeApiKey = '*****';
        const baseUrl = 'sdk.iad-01.braze.com';
        braze.initialize(brazeApiKey, {
            baseUrl,
            allowUserSuppliedJavascript: true,
            noCookies: true,
        });
        braze.changeUser(publicUserId);
        braze.openSession();
        braze.requestContentCardsRefresh();
        const { cards } = braze.getCachedContentCards();
        if (!cards.length) {
            return null;
        }
        const latestCard = cards[0] as braze.ClassicCard;
        const { description, title } = latestCard;
        handleCharCountErrors(title, description);
        return latestCard;
    }
    catch (error) {
        console.error('Error with braze instance in getLatestBrazeContentCard: ', error);
        return null;
    }
}
