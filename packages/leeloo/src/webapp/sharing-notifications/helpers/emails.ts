import { Credential, Note, Secret, SharedItemContent, } from '@dashlane/communication';
import { ItemforEmailing } from '@dashlane/sharing/types/acceptItemGroup';
function getSharingItemTypeForEmail(item: Credential | Note | Secret): 'password' | 'note' | 'secret' {
    switch (item.kwType) {
        case 'KWAuthentifiant':
            return 'password';
        case 'KWSecureNote':
            return 'note';
        default:
            return 'secret';
    }
}
export const getEmailInfoForSharedItem = (sharedItemContent: SharedItemContent): ItemforEmailing => {
    const type = getSharingItemTypeForEmail(sharedItemContent);
    const name = sharedItemContent.Title ?? '';
    return { type, name };
};
