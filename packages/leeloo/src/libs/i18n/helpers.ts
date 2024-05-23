export const isMarkupTextKey = (key: string) => {
    return key.includes('_markup');
};
export enum LocaleFormat {
    L = 'L',
    l = 'l',
    ll = 'll',
    LL = 'LL',
    lll = 'lll',
    L_M_D = 'L_M_D',
    YYYY = 'YYYY',
    M = 'M',
    MM = 'MM',
    MMM = 'MMM',
    MMM_YYYY = 'MMM_YYYY',
    MMMM = 'MMMM',
    MMMM_D = 'MMMM_D',
    MMMM_YYYY = 'MMMM_YYYY',
    LT = 'LT'
}
export enum DateTimeFormat {
    yMMddHHmmss = 'yMMddHHmmss'
}
export const LOCALE_FORMAT: Record<keyof typeof LocaleFormat, Intl.DateTimeFormatOptions> = {
    L: { year: 'numeric', month: '2-digit', day: '2-digit' },
    l: { year: 'numeric', month: 'numeric', day: 'numeric' },
    ll: { year: 'numeric', month: 'short', day: 'numeric' },
    LL: { year: 'numeric', month: 'long', day: 'numeric' },
    lll: {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
    },
    L_M_D: { month: 'short', day: 'numeric' },
    YYYY: { year: 'numeric' },
    M: { month: 'numeric' },
    MM: { month: '2-digit' },
    MMM: { month: 'short' },
    MMMM: { month: 'long' },
    MMMM_D: { month: 'long', day: 'numeric' },
    MMM_YYYY: { month: 'short', year: 'numeric' },
    MMMM_YYYY: { month: 'long', year: 'numeric' },
    LT: { hour: 'numeric', minute: 'numeric' },
};
export const DATE_TIME_FORMAT: Record<keyof typeof DateTimeFormat, string> = {
    yMMddHHmmss: 'yMMddHHmmss',
};
