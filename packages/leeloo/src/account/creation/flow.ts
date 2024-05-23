export type Indicator = 'teamTrial' | 'webAccount' | 'memberAccount' | 'standaloneAccount';
export const isStandalone = (flowIndicator: Indicator) => flowIndicator === 'standaloneAccount';
export const isTeamTrial = (flowIndicator: Indicator) => flowIndicator === 'teamTrial';
export const isTeamMemberAccount = (flowIndicator: Indicator) => flowIndicator === 'memberAccount';
export const isWebAccount = (flowIndicator: Indicator) => flowIndicator === 'webAccount';
export const createPathMap = {
    teamTrial: '/team/create',
    webAccount: '/account/create',
    memberAccount: '/member/create',
};
export const accountCreationPrefixMap = {
    teamTrial: 'team_account_creation_',
    webAccount: 'account_creation_',
    memberAccount: 'member_account_creation_',
};
export const variantMap = {
    teamTrial: 'teamTrialCreator',
    webAccount: 'webAccountCreation',
    memberAccount: 'memberAccountCreation',
};
