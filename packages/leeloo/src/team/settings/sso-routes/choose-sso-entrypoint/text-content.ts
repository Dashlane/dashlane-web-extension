import { InfoList, InfoListItemType } from './sso-option-card';
export const I18N_VALUES = {
    PAGE_TITLE: 'Choose your single sign-on (SSO) configuration',
    RESET_DESCRIPTION: 'Use this button to reset the SSO configuration in case of error',
};
export const DEFINE_ES_URL = '*****';
export const START_INFO_URL = '*****';
export type SsoCardValues = {
    TITLE: string;
    CTA: string;
    CONTINUE_CTA: string;
    INFO_LIST: InfoList;
};
export const SELF_HOSTED_SSO_VALUES: SsoCardValues = {
    TITLE: 'Self-hosted SSO',
    CTA: 'Set up self-hosted SSO',
    CONTINUE_CTA: 'Continue setup',
    INFO_LIST: [
        {
            text: 'Zero-knowledge security architecture',
            type: InfoListItemType.Pro,
        },
        {
            text: 'Simplified set-up',
            subtext: 'You’ll need to host and manage the encryption service yourself',
            type: InfoListItemType.Con,
        },
        {
            text: 'Verify multiple domains',
            type: InfoListItemType.Pro,
        },
        {
            text: 'Supports SCIM directory sync',
            type: InfoListItemType.Pro,
        },
    ],
};
export const getConfidentialSSOValues = (): SsoCardValues => ({
    TITLE: 'Confidential SSO',
    CTA: 'Set up Confidential SSO',
    CONTINUE_CTA: 'Continue setup',
    INFO_LIST: [
        {
            text: 'Zero-knowledge security architecture',
            type: InfoListItemType.Pro,
        },
        {
            text: 'Simplified set-up',
            subtext: 'The secure encryption service is hosted on the cloud for you',
            type: InfoListItemType.Pro,
        },
        {
            text: 'Verify multiple domains',
            type: InfoListItemType.Pro,
        },
        {
            text: 'Supports SCIM directory sync',
            type: InfoListItemType.Pro,
        },
    ],
});
export const SIDE_CARDS_VALUES = [
    {
        heading: 'What is an encryption service?',
        description: 'To maintain a zero-knowledge architecture when integrated with SSO or SCIM provisioning, Dashlane requires an additional layer of security we refer to as an encryption service.',
        linkText: 'Learn more',
        linkHref: DEFINE_ES_URL,
    },
    {
        heading: 'What do I need to start?',
        listIntro: 'To set up SSO, you’ll need',
        list: [
            'Access to your identity provider (IdP) and public DNS provider accounts',
            'A list of members to add to your SSO application',
            'IdP metadata',
            'Email domain',
        ],
        linkText: 'Learn more',
        linkHref: START_INFO_URL,
    },
];
