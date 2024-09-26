import { defaultTo } from "ramda";
import {
  GeneratedPassword,
  GeneratedPasswordItemView,
} from "@dashlane/communication";
const defaultToEmptyString = defaultTo("");
export const itemView = (
  generatedPassword: GeneratedPassword
): GeneratedPasswordItemView => {
  return {
    domain: defaultToEmptyString(generatedPassword.Domain),
    generatedDate: generatedPassword.GeneratedDate,
    password: generatedPassword.Password,
    id: generatedPassword.Id,
    platform: generatedPassword.Platform,
  };
};
export const listView = (
  generatedPasswords: GeneratedPassword[]
): GeneratedPasswordItemView[] => generatedPasswords.map(itemView);
