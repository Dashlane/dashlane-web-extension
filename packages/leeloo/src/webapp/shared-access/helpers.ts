import {
  Recipient,
  RecipientTypes,
  SharedAccessMember,
} from "@dashlane/sharing-contracts";
export const memberToRecipient = (member: SharedAccessMember): Recipient =>
  member.recipientType === RecipientTypes.Group ||
  member.recipientType === RecipientTypes.Collection
    ? {
        type: RecipientTypes.Group,
        groupId: member.recipientId,
        name: member.recipientName,
      }
    : { type: RecipientTypes.User, alias: member.recipientId };
