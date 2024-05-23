import { translationService } from 'libs/i18n';
const locale = translationService.getLocale();
export const formatDate = (date: number) => {
    const d = new Date(0);
    d.setUTCSeconds(date);
    return d.toLocaleString(locale, {
        day: 'numeric',
        month: 'short',
        hour: 'numeric',
        minute: 'numeric',
        hour12: false,
    });
};
