import {
  ApplicationModulesAccess,
  ApplicationModulesAccessInitOption,
} from "@dashlane/communication";
export function makeApplicationModulesAccess(
  option: ApplicationModulesAccessInitOption
): ApplicationModulesAccess {
  return {
    createClients: () => option(),
  };
}
