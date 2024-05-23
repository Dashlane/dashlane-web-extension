import { B2bPlanTier, EmailDomainError, EncryptionServicePlatformSelected, IdpValidationResponse, Page, SsoSetupStep, SsoSolutionChosen, TestSsoResponse, UserSetupSsoEvent, } from '@dashlane/hermes';
import { SpaceTier } from '@dashlane/team-admin-contracts';
import { logEvent, logPageView } from 'libs/logs/logEvent';
type LogSSOSetupParams = {
    currentBillingPlanTier: B2bPlanTier;
    emailDomainError?: EmailDomainError;
    emailDomainSubmittedCount?: number;
    emailDomainValidatedCount?: number;
    encryptionServicePlatformSelected?: EncryptionServicePlatformSelected;
    idpValidationResponse?: IdpValidationResponse;
    ssoSetupStep: SsoSetupStep;
    ssoSolutionChosen: SsoSolutionChosen;
    testSsoResponse?: TestSsoResponse;
};
type SelfHostedSSOSteps = SsoSetupStep.SetUpEncryptionServiceSettings | SsoSetupStep.SelectEncryptionServicePlatform | SsoSetupStep.GenerateAndSaveConfiguration | SsoSetupStep.AddConfigurationToServiceHost | SsoSetupStep.TurnOnSso | SsoSetupStep.CompleteSsoSetup | SsoSetupStep.ChooseYourSsoSolution | SsoSetupStep.ClearSsoSettings | SsoSetupStep.ReturnToSsoSelection;
type LogSelfHostedSSOSetupParams = Omit<LogSSOSetupParams, 'currentBillingPlanTier' | 'ssoSolutionChosen' | 'ssoSetupStep' | 'testSsoResponse'> & {
    currentBillingPlanTier?: SpaceTier;
    ssoSetupStep: SelfHostedSSOSteps;
};
type NitroSSOSteps = SsoSetupStep.CreateSsoApplication | SsoSetupStep.ValidateIdpMetadata | SsoSetupStep.UpdateIdpSettings | SsoSetupStep.SubmitEmailDomain | SsoSetupStep.EmailDomainError | SsoSetupStep.VerifyDomain | SsoSetupStep.TestSsoConnection | SsoSetupStep.TurnOnSso | SsoSetupStep.CompleteSsoSetup | SsoSetupStep.ChooseYourSsoSolution | SsoSetupStep.ClearSsoSettings | SsoSetupStep.ReturnToSsoSelection;
type LogNitroSSOSetupParams = Omit<LogSSOSetupParams, 'currentBillingPlanTier' | 'encryptionServicePlatformSelected' | 'ssoSolutionChosen' | 'ssoSetupStep'> & {
    currentBillingPlanTier?: SpaceTier;
    ssoSetupStep: NitroSSOSteps;
};
const planTierMap = new Map<SpaceTier, B2bPlanTier>([
    [SpaceTier.Business, B2bPlanTier.Business],
    [SpaceTier.Team, B2bPlanTier.Team],
    [SpaceTier.Legacy, B2bPlanTier.Legacy],
    [SpaceTier.Enterprise, B2bPlanTier.Business],
]);
const logSSOSetupStep = ({ currentBillingPlanTier, emailDomainError, emailDomainSubmittedCount, emailDomainValidatedCount, encryptionServicePlatformSelected, idpValidationResponse, ssoSetupStep, ssoSolutionChosen, testSsoResponse, }: LogSSOSetupParams) => {
    logEvent(new UserSetupSsoEvent({
        currentBillingPlanTier,
        emailDomainError: emailDomainError ?? EmailDomainError.OtherError,
        emailDomainSubmittedCount: emailDomainSubmittedCount ?? 0,
        emailDomainValidatedCount: emailDomainValidatedCount ?? 0,
        encryptionServicePlatformSelected: encryptionServicePlatformSelected ??
            EncryptionServicePlatformSelected.AmazonWebServices,
        idpValidationResponse: idpValidationResponse ?? IdpValidationResponse.Success,
        ssoSetupStep,
        ssoSolutionChosen,
        testSsoResponse: testSsoResponse ?? TestSsoResponse.NotTested,
    }));
};
const getPlanTier = (planTier?: SpaceTier): B2bPlanTier => {
    return planTier
        ? planTierMap.get(planTier) || B2bPlanTier.Business
        : B2bPlanTier.Business;
};
export const logSelfHostedSSOSetupStep = (params: LogSelfHostedSSOSetupParams) => {
    logSSOSetupStep({
        ...params,
        currentBillingPlanTier: getPlanTier(params.currentBillingPlanTier),
        ssoSolutionChosen: SsoSolutionChosen.SelfHostedSso,
    });
};
export const logNitroSSOSetupStep = (params: LogNitroSSOSetupParams) => {
    logSSOSetupStep({
        ...params,
        currentBillingPlanTier: getPlanTier(params.currentBillingPlanTier),
        ssoSolutionChosen: SsoSolutionChosen.NitroSso,
    });
};
export const logSSOLandingPageView = () => {
    logPageView(Page.TacSso);
};
