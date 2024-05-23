import { IconProps } from '@dashlane/design-system';
export interface UpgradePlanData {
    header: {
        key: string;
        variables?: Record<string, unknown>;
    };
    description: {
        key: string;
        variables?: Record<string, unknown>;
    };
    features: {
        key: string;
        iconName: IconProps['name'];
        variables?: Record<string, unknown>;
    }[];
    cta: {
        key: string;
        external?: boolean;
        link: string;
    };
}
