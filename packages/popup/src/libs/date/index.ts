export const ONE_HOUR_IN_SECONDS = 60 * 60;
export const ONE_DAY_IN_SECONDS = 24 * ONE_HOUR_IN_SECONDS;
export const ONE_DAY_IN_MILLISECONDS = ONE_DAY_IN_SECONDS * 1000;
export const formatUtcToMillisecondsDate = (date: number): number => {
    const d = new Date(0);
    d.setUTCSeconds(date);
    return d.getTime();
};
export const isXDaysBeforeDate = (days: number, date?: number): boolean => {
    if (date !== undefined) {
        const formatedDate = formatUtcToMillisecondsDate(date);
        return (formatedDate - Date.now() < days * ONE_DAY_IN_MILLISECONDS &&
            formatedDate - Date.now() > 0);
    }
    return false;
};
export const dayCountBeforeDate = (date?: number): number | null => {
    return date !== undefined
        ? Math.round((formatUtcToMillisecondsDate(date) - Date.now()) /
            ONE_DAY_IN_MILLISECONDS)
        : null;
};
