import { DEFAULT_FLEXIBLE_ARGON2D_DERIVATION_CONFIG, DEFAULT_FLEXIBLE_PBKDF2_DERIVATION_CONFIG, } from '@dashlane/framework-services';
export const makeDerivationConfig = (marker: string) => {
    const [, , algorithm] = marker.split('$');
    return algorithm === 'pbkdf2'
        ? DEFAULT_FLEXIBLE_PBKDF2_DERIVATION_CONFIG
        : DEFAULT_FLEXIBLE_ARGON2D_DERIVATION_CONFIG;
};
