import { makeTranslate } from './translate';
import { Lee, LeeWithStorage } from '../../lee';
import styleVars from '../../libs/styleVariables';
import { emptyState } from '../../libs/carbon/reducer';
import { GlobalState } from '../../store/types';
import { IdVaultItemType } from 'webapp/ids/types';
import { getVaultItemRouteTypeDictionary } from 'app/routes/services';
export interface LeeConfig {
    globalState?: Partial<GlobalState>;
}
export const trimBraces = (uuid: string) => uuid.slice(1, -1);
export function makeLee(leeConfig: LeeConfig = {}): Lee {
    return {
        carbon: emptyState,
        dispatchGlobal: jest.fn(),
        globalState: leeConfig.globalState,
        permission: {
            loggedIn: true,
            adminAccess: {
                hasTACAccess: true,
                hasBillingAccess: true,
                hasFullAccess: true,
                hasGroupAccess: false,
                hasPermissionLevel: () => true,
            },
        },
        reportError: jest.fn(() => {
        }),
        styleVars,
        routes: {
            importData: 'foo/importDataPath',
            teamActivityRoutePath: 'foo/teamActivityRoutePath',
            teamDarkWebInsightsRoutePath: 'foo/teamDarkWebInsightsRoutePath',
            teamRoutesBasePath: 'foo/teamRoutesBasePath',
            teamMembersRoutePath: 'foo/teamMembersRoutePath',
            teamSettingsRoutePath: 'foo/teamSettingsRoutePath',
            teamAccountRoutePath: 'foo/teamAccountRoutePath',
            teamDashboardRoutePath: 'foo/teamDashboardRoutePath',
            teamGroupsRoutePath: 'foo/teamGroupsRoutePath',
            teamGroupRoutePath: (teamUuid: string) => `foo/teamGroupRoutePath/${teamUuid}`,
            clientRoutesBasePath: 'foo/clientRoutesBasePath',
            userAddMobile: 'foo/onboarding/add-mobile',
            userBankAccount: (uuid: string) => `foo/userPayment/bank-account/${trimBraces(uuid)}`,
            userTryAutofill: 'foo/onboarding/try-autofill',
            userCredentials: 'foo/userCredentials',
            userCredential: (credentialUuid: string): string => `foo/${trimBraces(credentialUuid)}`,
            userEditPrivacy: (subCode?: string) => `foo/userEditPrivacy/${subCode}`,
            userSecureNotes: 'foo/userSecureNotes',
            userSecureNote: (secureNoteUuid: string) => `foo/userSecureNote/${trimBraces(secureNoteUuid)}`,
            userSecrets: 'foo/userSecrets',
            userSecret: (secretUuid: string) => `foo/userSecrets/${trimBraces(secretUuid)}`,
            userPasswordSites: 'foo/onboarding/add-password',
            userPersonalInfo: 'foo/userPersonalInfo',
            userPersonalInfoEmail: (uuid: string) => `foo/userPIEmail/${trimBraces(uuid)}`,
            userPersonalInfoPhone: (uuid: string) => `foo/userPIPhone/${trimBraces(uuid)}`,
            userPersonalInfoIdentity: (uuid: string) => `foo/userPIId/${trimBraces(uuid)}`,
            userPersonalInfoAddress: (uuid: string) => `foo/userPIAddress/${trimBraces(uuid)}`,
            userPersonalInfoCompany: (uuid: string) => `foo/userPICompany/${trimBraces(uuid)}`,
            userPersonalInfoWebsite: (uuid: string) => `foo/userPIWebsite/${trimBraces(uuid)}`,
            userPayments: 'foo/userPayments',
            userPaymentCard: (uuid: string) => `foo/userPayment/card/${trimBraces(uuid)}`,
            userIdsDocuments: 'foo/userIdsDocuments',
            userAddIdDocument: (type: IdVaultItemType) => `foo/userIdsDocument${getVaultItemRouteTypeDictionary[type]}/add`,
            userEditIdDocument: (type: IdVaultItemType, id: string) => `foo/userIdsDocument${getVaultItemRouteTypeDictionary[type]}/${trimBraces(id)}`,
            userSharingCenter: 'foo/userSharingCenter',
            userEmergency: 'foo/userEmergency',
            userSettings: 'foo/userSettings',
            userUpsell: 'foo/userUpsell',
            userGoPlans: 'foo/userGoPlans/',
            userGoPremium: (subCode?: string) => `foo/userGoPremium/${subCode}`,
            userGoEssentials: (subCode?: string) => `foo/userGoEssentials/${subCode}`,
            userGoFamily: (subCode?: string) => `foo/userGoFamily/${subCode}`,
            userOnboarding: 'foo/onboarding',
        },
        translate: makeTranslate(),
    } as any as Lee;
}
export function makeLeeWithStorage<T>(cursorState = {}, leeConfig = {}): LeeWithStorage<T> {
    const lee = makeLee(leeConfig);
    const leeWithStorage: LeeWithStorage<any> = Object.assign({}, lee, {
        child: jest.fn(),
        dispatch: jest.fn(),
        state: cursorState,
    });
    return leeWithStorage;
}
