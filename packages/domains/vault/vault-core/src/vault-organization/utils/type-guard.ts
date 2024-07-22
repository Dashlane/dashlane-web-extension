import { Credential } from "@dashlane/communication";
export const isCredentialsArray = (x: unknown): x is Credential[] =>
  Array.isArray(x);
