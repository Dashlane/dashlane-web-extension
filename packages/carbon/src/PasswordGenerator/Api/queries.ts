import { PasswordGenerationSettings } from "@dashlane/communication";
import { Query } from "Shared/Api";
export type PasswordGeneratorQueries = {
  getPasswordGenerationSettings: Query<void, PasswordGenerationSettings>;
};
