import { translate } from 'libs/i18n';
import { REFUSED_MEMBER_KEYS } from 'team/invite-result-dialog/types';
import { DASHLANE_SUPPORT, LIMITATION_FOR_SSO } from 'team/urls';
export const getInviteDialogErrorText = (key?: string) => {
    switch (key) {
        case REFUSED_MEMBER_KEYS.INVITE_RESTRICTED:
            return translate.markup(REFUSED_MEMBER_KEYS.INVITE_RESTRICTED, {
                helpCenter: LIMITATION_FOR_SSO,
            });
        case REFUSED_MEMBER_KEYS.PRE_EXISTING_MP_USER:
            return translate.markup(REFUSED_MEMBER_KEYS.PRE_EXISTING_MP_USER, {
                ssoLimitations: LIMITATION_FOR_SSO,
                dashlaneSupport: DASHLANE_SUPPORT,
            });
        default:
            return translate.markup(REFUSED_MEMBER_KEYS.GENERIC_ERROR, {
                helpCenter: DASHLANE_SUPPORT,
            });
    }
};
