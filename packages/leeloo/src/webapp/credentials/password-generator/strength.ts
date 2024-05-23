export type StrengthName = 'too_guessable' | 'very_guessable' | 'somewhat_guessable' | 'safely_unguessable' | 'very_unguessable' | '';
const StrengthValues: {
    [key: number]: StrengthName;
} = {
    0: 'too_guessable',
    1: 'very_guessable',
    2: 'somewhat_guessable',
    3: 'safely_unguessable',
    4: 'very_unguessable',
};
export function getZxcvbnScoreFrom100BaseStrength(strength: number): 0 | 1 | 2 | 3 | 4 | undefined {
    if (strength >= 4 * 25) {
        return 4;
    }
    if (strength >= 3 * 25) {
        return 3;
    }
    if (strength >= 2 * 25) {
        return 2;
    }
    if (strength >= 1 * 25) {
        return 1;
    }
    if (strength >= 0) {
        return 0;
    }
    return undefined;
}
export function getStrengthName(strength: number): StrengthName {
    const score = getZxcvbnScoreFrom100BaseStrength(strength);
    return score ? StrengthValues[score] : '';
}
export function getStrengthI18nKey(strength: number) {
    return `webapp_credential_edition_field_generator_strength/${getStrengthName(strength) || 'none'}`;
}
