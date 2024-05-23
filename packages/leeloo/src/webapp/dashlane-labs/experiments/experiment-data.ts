export type ExperimentData = {
    name: string;
    description: string;
    supportLink: string;
    isNew: boolean;
};
const experimentData: Record<string, Partial<ExperimentData>> = {
    onboarding_web_disablepersonalspace_v2_dev: {
        name: 'Disable Personal Space',
        description: 'Automatically use the Organization provided space to store your credentials. The Personal Space will be disabled.',
    },
    web_disable_password_health: {
        name: 'Disable Password Health',
        description: 'Prevent the vault Security Score to be computed for large vaults.',
    },
    onboarding_web_tacgetstarted: {
        name: 'Team Admin Console Get Started',
        description: 'Enable the Organization Admin to access the Get Started section.',
    },
};
export const getExperimentData = (experiment: string): ExperimentData => ({
    ...{
        name: experiment,
        description: '',
        supportLink: '',
        isNew: false,
    },
    ...experimentData[experiment],
});
