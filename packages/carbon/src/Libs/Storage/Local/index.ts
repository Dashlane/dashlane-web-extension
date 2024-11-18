import {
  makeUserLocalDataService,
  UserLocalDataService,
} from "Libs/Storage/User/index";
import { LocalStorageService, UserLocalDataServices } from "./types";
export const makeLocalStorageService = (
  services: UserLocalDataServices
): LocalStorageService => {
  let userLocalStorageService: UserLocalDataService | null = null;
  return {
    setInstance: (login: string) => {
      userLocalStorageService = makeUserLocalDataService(services, login);
    },
    getInstance: (): UserLocalDataService => {
      if (!userLocalStorageService) {
        throw new Error(
          "makeLocalStorageService: You must call setInstance(login: string) before getting the instance"
        );
      }
      return userLocalStorageService;
    },
  };
};
