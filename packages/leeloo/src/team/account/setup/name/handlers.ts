import { getAuth } from 'user';
import { Lee } from 'app/createElement/makeLee';
import TeamPlans from 'libs/api/TeamPlans';
import { TranslatorInterface } from 'libs/i18n/types';
enum ErrorType {
    DUPLICATE,
    SOMETHING_WRONG,
    EMPTY,
    MALFORMED
}
const getErrorMessage = (translate: TranslatorInterface, errorType: ErrorType) => {
    switch (errorType) {
        case ErrorType.DUPLICATE:
            return translate('team_account_name_already_exists');
        case ErrorType.SOMETHING_WRONG:
            return translate('team_account_name_error_something_wrong');
        case ErrorType.EMPTY:
            return translate('team_account_name_is_empty');
        case ErrorType.MALFORMED:
            return translate('team_account_name_is_malformed');
        default:
            return translate('team_account_name_error_something_wrong');
    }
};
export const saveTeamName = async (teamName: string, lee: Lee, translate: TranslatorInterface, reportTACError: (error: Error, message?: string) => void): Promise<string> => {
    const auth = getAuth(lee.globalState);
    if (!auth) {
        const error = new Error(getErrorMessage(translate, ErrorType.SOMETHING_WRONG));
        reportTACError(error);
        throw error;
    }
    if (!teamName.length) {
        throw new Error(getErrorMessage(translate, ErrorType.EMPTY));
    }
    if (!/^[\w\s-.]*$/.test(teamName)) {
        throw new Error(getErrorMessage(translate, ErrorType.MALFORMED));
    }
    try {
        const resp = await new TeamPlans().editSettings({
            auth,
            operations: [
                {
                    type: 'set_name',
                    value: teamName,
                },
            ],
        });
        return resp.content.team?.info.name ?? '';
    }
    catch (error) {
        const errorType = error.message === 'team_name_already_exists'
            ? ErrorType.DUPLICATE
            : ErrorType.SOMETHING_WRONG;
        throw new Error(getErrorMessage(translate, errorType));
    }
};
