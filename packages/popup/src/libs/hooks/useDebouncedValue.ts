import * as React from 'react';
export const useDebouncedValue = <T>(value: T, delay: number): T => {
    const [debouncedValue, setDebouncedValue] = React.useState(value);
    React.useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);
        return () => {
            clearTimeout(handler);
        };
    }, [value, delay]);
    return debouncedValue;
};
