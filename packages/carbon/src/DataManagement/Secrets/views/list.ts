import { Secret, SecretItemView } from "@dashlane/communication";
import { curry, defaultTo } from "ramda";
import { dataModelItemView } from "DataManagement/views";
import { createdAt, updatedAt } from "DataManagement/Secrets/helpers";
const defaultToEmptyString = defaultTo("");
const abbreviate = (content: string): string => {
  const threshold = 30;
  if (content.length > threshold) {
    return content.slice(0, threshold - 3) + "\u2026";
  }
  return content;
};
export const itemView = curry((secret: Secret): SecretItemView => {
  const content = abbreviate(defaultToEmptyString(secret.Content));
  return {
    ...dataModelItemView(secret),
    abbrContent: content,
    createdAt: createdAt(secret),
    title: defaultToEmptyString(secret.Title),
    updatedAt: updatedAt(secret),
  };
});
export const listView = (secrets: Secret[]) => secrets.map(itemView);
