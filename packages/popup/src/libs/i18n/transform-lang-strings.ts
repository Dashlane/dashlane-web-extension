import { Translation } from 'libs/i18n/types';
function transform(s: string) {
    return (s
        .replace(/%(?!\()/g, '%%'));
}
export default function transformDictionary(dict: {
    [k: string]: Translation;
}) {
    const result = {};
    Object.keys(dict).forEach(k => {
        const val = dict[k];
        if (typeof val === 'string') {
            result[k] = transform(val);
        }
        else {
            result[k] = transformDictionary((val as any) as {
                [k: string]: string;
            });
        }
    });
    return result;
}
