const DASHLANE_VPN_URL = '*****';
const DASHLANE_SUPPORT_ARTICLE_URL = '*****';
export const HOTSPOT_SHIELD_URL = '*****';
export const HOTSPOTSHIELD_INSTALL_URL = `${DASHLANE_VPN_URL}/install`;
export const HOTSPOTSHIELD_INSTALL_URL_MAP = {
    Windows: `${HOTSPOTSHIELD_INSTALL_URL}/windows`,
    'Mac OS': `${HOTSPOTSHIELD_INSTALL_URL}/mac`,
    Linux: `${HOTSPOTSHIELD_INSTALL_URL}/linux`,
};
export const HOTSPOTSHIELD_TERMS_URL = `${DASHLANE_VPN_URL}/terms`;
export const HOTSPOTSHIELD_PRIVACY_POLICY_URL = `${DASHLANE_VPN_URL}/privacy-policy`;
export const HOTSPOTSHIELD_SUPPORT_URL = `${DASHLANE_VPN_URL}/support`;
const VPN_FAQ_UTM_MEDIUM = 'vpn-faq';
const UTM_SOURCE = APP_PACKAGED_IN_EXTENSION ? 'extension' : 'webapp';
const VPN_UTM_MEDIUM = 'vpn';
const createSuppotArticleLink = (id: string, medium: string, source: string) => `${DASHLANE_SUPPORT_ARTICLE_URL}/${id}?utmMedium=${medium}&amp;utmSource=${source}`;
export const VPN_READ_MORE_LINK = createSuppotArticleLink('360001158385', VPN_FAQ_UTM_MEDIUM, UTM_SOURCE);
export const VPN_FAQ_LINK = createSuppotArticleLink('360000037900', VPN_FAQ_UTM_MEDIUM, UTM_SOURCE);
export const VPN_LEARN_MORE = createSuppotArticleLink('360000045439', VPN_UTM_MEDIUM, UTM_SOURCE);
export const OPEN_IN_NEW_TAB = '_blank';
