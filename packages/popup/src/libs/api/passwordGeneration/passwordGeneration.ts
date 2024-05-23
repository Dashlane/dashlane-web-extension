import { PasswordGenerationSettings } from '@dashlane/communication';
import { carbonConnector } from 'src/carbonConnector';
export const generatePassword = async (settings: PasswordGenerationSettings) => {
    return await carbonConnector.generatePassword({ settings });
};
export const saveGeneratedPassword = async (password: string) => {
    return await carbonConnector.saveGeneratedPassword({ password });
};
export const getGeneratedPasswordsList = async () => {
    return await carbonConnector.getGeneratedPasswords({
        sortToken: {
            sortCriteria: [
                {
                    field: 'generatedDate',
                    direction: 'descend',
                },
            ],
            uniqField: 'id',
        },
        filterToken: {
            filterCriteria: [],
        },
        limit: 20,
    });
};
