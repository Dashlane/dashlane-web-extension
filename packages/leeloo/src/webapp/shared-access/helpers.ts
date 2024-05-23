import { Recipient } from '@dashlane/communication';
import { RecipientTypes, SharedAccessMember, } from '@dashlane/sharing-contracts';
export const memberToRecipient = (member: SharedAccessMember): Recipient => member.recipientType === RecipientTypes.Group ||
    member.recipientType === RecipientTypes.Collection
    ? {
        type: 'userGroup',
        groupId: member.recipientId,
        name: member.recipientName,
    }
    : { type: 'user', alias: member.recipientId };
