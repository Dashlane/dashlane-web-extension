import { Country, CredentialItemView } from '@dashlane/communication';
import { Credential, NoteColors, SecureNote } from '@dashlane/vault-contracts';
const makeIndentifier = (index = 0) => `{A1234567-1111-2222-AAAA-${index.toString().padEnd(11, '0')}}`;
export const baseItemView = {
    id: makeIndentifier(),
    anonId: makeIndentifier(),
    hasAttachments: false,
    kwType: '',
    localeFormat: Country.FR,
    spaceId: '',
};
const baseCredential: Credential = {
    ...baseItemView,
    email: 'john.smith@gmail.com',
    itemName: 'mywebsite',
    username: 'john.smith',
    URL: '*****',
    password: '*****',
    alternativeUsername: '',
    linkedURLs: [],
    lastBackupTime: 1696500646218,
};
export const mockCredential = (props?: Partial<Credential>): Credential => ({
    ...baseCredential,
    ...props,
});
const mockCarbonCredential: CredentialItemView = {
    ...baseItemView,
    sharingSatus: { isShared: false },
    autoProtected: false,
    email: 'john.smith@gmail.com',
    title: 'mywebsite',
    login: 'john.smith',
    url: '*****',
    password: '*****',
};
export const mockCarbonCredentialsWithUrl = (URLs: string[]): CredentialItemView[] => {
    return URLs.map((URL, index) => {
        const id = makeIndentifier(index);
        return {
            ...mockCarbonCredential,
            url: URL,
            title: URL,
            id,
        };
    });
};
export const mockSecureNote = (props?: Partial<SecureNote>): SecureNote => {
    return {
        ...baseItemView,
        categoryId: '',
        color: NoteColors.GREEN,
        title: 'Testy Note',
        content: '',
        isSecured: false,
        lastBackupTime: 0,
        ...props,
    };
};
export const appleWebsite = {
    fullUrl: '*****',
    domain: 'apple.com',
    autofillDisabledOnPage: false,
    autofillDisabledOnSite: false,
    autologinDisabledOnPage: false,
    autologinDisabledOnSite: false,
    disabledFromSpaces: false,
};
export const urlsOfSuggestedItemsForApple = [
    '*****',
    '*****',
    '*****',
    '*****',
    '*****',
];
