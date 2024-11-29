import { GroupRecipient, UserRecipient } from "@dashlane/communication";
export const isUserGroup = (
  entity: UserRecipient | GroupRecipient
): entity is GroupRecipient => {
  return entity.type === "userGroup";
};
