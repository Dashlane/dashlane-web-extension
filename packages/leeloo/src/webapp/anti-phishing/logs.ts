import { AnonymousAntiphishingRedirectEvent, BrowseComponent, DomainType, hashDomain, HelpCenterArticleCta, Page, UserAntiphishingRedirectEvent, UserOpenHelpCenterEvent, } from '@dashlane/hermes';
import { ParsedURL } from '@dashlane/url-parser';
import { logEvent, logPageView } from 'libs/logs/logEvent';
export const onBlogClick = () => {
    logEvent(new UserOpenHelpCenterEvent({
        helpCenterArticleCta: HelpCenterArticleCta.GetAntiphishingTips,
    }));
};
export const onPageViewLog = () => logPageView(Page.AntiphishingRedirect, BrowseComponent.MainApp);
export const onRedirectionLog = (phishingDomain: string) => {
    logEvent(new UserAntiphishingRedirectEvent({}));
    Promise.all([
        hashDomain(new ParsedURL(phishingDomain).getRootDomain()),
        hashDomain('*****'),
    ]).then((hashes) => {
        logEvent(new AnonymousAntiphishingRedirectEvent({
            phishingDomain: {
                type: DomainType.Web,
                id: hashes[0],
            },
            redirectDomain: {
                type: DomainType.Web,
                id: hashes[1],
            },
        }));
    });
};
