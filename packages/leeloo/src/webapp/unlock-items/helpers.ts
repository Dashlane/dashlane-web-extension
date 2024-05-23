import { UnlockRequestCustomizableField, UnlockRequestTranslatedField, UnlockRequestTranslationKey, UnlockRequestTranslationOptions, } from './types';
export const getUnlockRequestTranslationOption = (field: UnlockRequestCustomizableField, options?: UnlockRequestTranslationOptions): UnlockRequestTranslatedField | UnlockRequestTranslationKey | undefined => {
    if (options) {
        if (options.translated) {
            return options.fields[field]
                ? { translated: true, field: options.fields[field] }
                : undefined;
        }
        else {
            const key = options.fieldsKeys[field];
            return key ? { translated: false, key } : undefined;
        }
    }
    return undefined;
};
