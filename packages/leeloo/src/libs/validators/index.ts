export const EMAIL_REGEX = /^[^\s@]+@([^\s@])+\.([^\s@])+$/i;
export interface EvaluatePasswordStrength {
    meetsLength: boolean;
    hasLowerCase: boolean;
    hasUpperCase: boolean;
    hasNumeric: boolean;
}
export function evaluatePasswordStrength(password: string): EvaluatePasswordStrength {
    const PASSWORD_CHARS_LCASE = 'abcdefghijklmnopqrstuvwxyz';
    const PASSWORD_CHARS_UCASE = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const PASSWORD_CHARS_NUMERIC = '0123456789';
    let cur: string;
    let meetsLength = false;
    let hasLowerCase = false;
    let hasUpperCase = false;
    let hasNumeric = false;
    if (password.length > 7) {
        meetsLength = true;
    }
    for (let i = 0; i < password.length; i++) {
        cur = password[i];
        if (PASSWORD_CHARS_LCASE.includes(cur)) {
            hasLowerCase = true;
        }
        if (PASSWORD_CHARS_UCASE.includes(cur)) {
            hasUpperCase = true;
        }
        if (PASSWORD_CHARS_NUMERIC.includes(cur)) {
            hasNumeric = true;
        }
    }
    return {
        meetsLength,
        hasLowerCase,
        hasUpperCase,
        hasNumeric,
    };
}
export function isValidPassword(password: string) {
    const passwordStrength = evaluatePasswordStrength(password);
    return Object.values(passwordStrength).every((v) => v);
}
export function isValidEmail(email: string | null) {
    return !email ? false : EMAIL_REGEX.test(email);
}
