import { GeneratedPasswordMappers } from "DataManagement/GeneratedPassword/types";
export const getGeneratedPasswordMappers = (): GeneratedPasswordMappers => ({
  id: (generatedPassword) => generatedPassword.Id,
  domain: (generatedPassword) => generatedPassword.Domain,
  generatedDate: (generatedPassword) => generatedPassword.GeneratedDate,
});
