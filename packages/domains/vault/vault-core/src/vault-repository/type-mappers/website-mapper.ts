import { PersonalWebsite } from "@dashlane/communication";
import { Website } from "@dashlane/vault-contracts";
import { mapKeysToLowercase } from "../utility";
export const websiteMapper = (personalWebsite: PersonalWebsite): Website => {
  const { Website, Name, PersonalNote, LocaleFormat, ...rest } =
    personalWebsite;
  return {
    ...mapKeysToLowercase(rest),
    itemName: Name,
    URL: Website,
  };
};
