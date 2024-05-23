import { useEffect, useMemo, useState } from 'react';
import { DataStatus } from '@dashlane/framework-react';
import { Button, Checkbox, Infobox, jsx, TextInput, } from '@dashlane/design-system';
import { FlexContainer, Heading, Link, Lockup, LockupColor, LockupSize, OpenWebsiteIcon, Paragraph, } from '@dashlane/ui-components';
import useTranslate from 'libs/i18n/useTranslate';
import { Redirect } from 'libs/router/dom';
import { parseUrlSearchParams } from 'libs/router';
import { useRouterGlobalSettingsContext } from 'libs/router/RouterGlobalSettingsProvider';
import { DASHLANE_BLOG_URL } from '../urls';
import { getTokenURL } from './helper';
import { useAntiphishing } from './hooks/use-antiphishing';
import { onBlogClick, onPageViewLog, onRedirectionLog } from './logs';
const I18N_KEYS = {
    ANTI_PHISHING_TITLE: 'anti_phishing_title',
    ANTI_PHISHING_DESCRIPTION: 'anti_phishing_description_markup',
    ANTI_PHISHING_PHISHING_DOMAIN: 'anti_phishing_phishing_domain',
    ANTI_PHISHING_TARGETED_DOMAIN: 'anti_phishing_targeted_domain',
    ANTI_PHISHING_PUNYCODE_INFO: 'anti_phishing_punycode_info',
    ANTI_PHISHING_REDIRECT_CHECKBOX: 'anti_phishing_redirect_checkbox',
    ANTI_PHISHING_BLOG_LINK: 'anti_phishing_blog_link',
    ANTI_PHISHING_GO_TO_DASHLANE_LINK: 'anti_phishing_go_to_dashlane_link',
};
const DOMAIN_WITHOUT_SPECIAL_CHARACTERS_REGEX = /^[_a-zA-Z0-9-\.]*$/im;
const PHISHING_BLOG_ARTICLE = `${DASHLANE_BLOG_URL}/dont-take-the-bait-password-managers-can-help-shield-you-from-phishing-attacks/`;
const TARGETED_DOMAIN = '*****';
export const AntiPhishing = () => {
    const { routes: { clientRoutesBasePath }, } = useRouterGlobalSettingsContext();
    const { translate } = useTranslate();
    const [isRedirectButtonClicked, setIsRedirectButtonClicked] = useState(false);
    const [hasToBeAddedToRedirectionList, setHasToBeAddedToRedirectionList] = useState(false);
    const RedirectToWebApp = <Redirect to={clientRoutesBasePath}/>;
    const phishingDomain = useMemo(() => {
        if (!window.location.search) {
            return null;
        }
        const token = parseUrlSearchParams(window.location.search).get('token');
        return token ? getTokenURL(token) : null;
    }, [window.location.search]);
    const { isAutoRedirected, addToAutoRedirectedDomain } = useAntiphishing(phishingDomain);
    const hasNonAsciiCharacters = useMemo(() => !DOMAIN_WITHOUT_SPECIAL_CHARACTERS_REGEX.test(phishingDomain ?? ''), [phishingDomain]);
    useEffect(() => onPageViewLog(), []);
    if (isAutoRedirected.status !== DataStatus.Success) {
        return null;
    }
    if (!phishingDomain || isAutoRedirected.data) {
        if (phishingDomain) {
            onRedirectionLog(phishingDomain);
        }
        return RedirectToWebApp;
    }
    const onRedirectButtonHandler = async () => {
        if (hasToBeAddedToRedirectionList) {
            await addToAutoRedirectedDomain();
        }
        onRedirectionLog(phishingDomain);
        setIsRedirectButtonClicked(true);
    };
    const onCheckHandler = (): void => {
        setHasToBeAddedToRedirectionList(!hasToBeAddedToRedirectionList);
    };
    if (isRedirectButtonClicked) {
        return RedirectToWebApp;
    }
    return (<div sx={{
            padding: '80px 32px 16px 32px',
        }}>
      <div sx={{
            width: '100%',
            height: '100%',
            maxWidth: '560px',
            margin: '0 auto',
        }}>
        <Lockup size={LockupSize.Size48} color={LockupColor.DashGreen}/>
        <Heading size="medium" sx={{ marginTop: '56px', marginBottom: '16px' }}>
          {translate(I18N_KEYS.ANTI_PHISHING_TITLE)}
        </Heading>
        <Paragraph size={'large'} sx={{ marginBottom: '40px' }}>
          {translate.markup(I18N_KEYS.ANTI_PHISHING_DESCRIPTION, {
            targetedDomain: TARGETED_DOMAIN,
        })}
        </Paragraph>
        <FlexContainer flexDirection={'row'} flexWrap={'nowrap'} gap={24} sx={{ marginBottom: '24px' }}>
          <TextInput value={phishingDomain} label={translate(I18N_KEYS.ANTI_PHISHING_PHISHING_DOMAIN)} sx={{
            '> div': {
                borderColor: 'ds.border.danger.standard.idle',
            },
            '> label': {
                color: 'ds.text.danger.quiet',
            },
            input: {
                fontWeight: 600,
            },
        }}/>
          <TextInput value={TARGETED_DOMAIN} label={translate(I18N_KEYS.ANTI_PHISHING_TARGETED_DOMAIN)} sx={{
            '> div': {
                borderColor: 'ds.border.positive.standard.idle',
            },
            '> label': {
                color: 'ds.text.positive.quiet',
            },
            input: {
                fontWeight: 600,
            },
        }}/>
        </FlexContainer>
        {hasNonAsciiCharacters ? (<Infobox size="small" title={translate(I18N_KEYS.ANTI_PHISHING_PUNYCODE_INFO)}/>) : null}
        <Link sx={{
            color: 'ds.text.brand.standard',
            margin: '40px 0',
            display: 'block',
        }} target={'_blank'} onClick={onBlogClick} href={PHISHING_BLOG_ARTICLE}>
          {translate(I18N_KEYS.ANTI_PHISHING_BLOG_LINK)}
          <OpenWebsiteIcon color="ds.text.brand.standard" size={16} sx={{
            marginLeft: '4px',
            verticalAlign: 'bottom',
            display: 'inline',
        }}/>
        </Link>
        <Checkbox sx={{ marginBottom: '40px' }} checked={hasToBeAddedToRedirectionList} onClick={onCheckHandler} label={translate(I18N_KEYS.ANTI_PHISHING_REDIRECT_CHECKBOX)}/>
        <FlexContainer flexDirection={'row-reverse'}>
          <Button type="button" mood="brand" onClick={onRedirectButtonHandler}>
            {translate(I18N_KEYS.ANTI_PHISHING_GO_TO_DASHLANE_LINK)}
          </Button>
        </FlexContainer>
      </div>
    </div>);
};
