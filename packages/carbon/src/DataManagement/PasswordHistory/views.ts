import {
  IconDataStructure,
  PasswordHistoryItemType,
  PasswordHistoryItemView,
} from "@dashlane/communication";
import { PasswordHistoryItem } from "DataManagement/PasswordHistory/types";
export const listView = (
  getIconByDomain: (domain: string) => IconDataStructure,
  items: PasswordHistoryItem[]
): PasswordHistoryItemView[] => {
  return items.map((item) => {
    if (item.type === PasswordHistoryItemType.Credential) {
      return {
        type: PasswordHistoryItemType.Credential,
        id: item.id,
        primaryInfo: item.primaryInfo,
        secondaryInfo: item.secondaryInfo,
        password: item.password,
        timestamp: item.timestamp,
        credentialId: item.credentialId,
        icons: getIconByDomain(item.domain),
        isProtected: item.isProtected,
        spaceId: item.spaceId,
        domain: item.domain,
      };
    }
    return {
      type: PasswordHistoryItemType.Generated,
      id: item.id,
      primaryInfo: item.primaryInfo,
      password: item.password,
      timestamp: item.timestamp,
    };
  });
};
