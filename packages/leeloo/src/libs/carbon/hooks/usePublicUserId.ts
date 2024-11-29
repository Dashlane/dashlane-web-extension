import { useEffect, useState } from "react";
import { DataStatus, useModuleQuery } from "@dashlane/framework-react";
import { useUserLoginStatus } from "./useUserLoginStatus";
import { sessionApi } from "@dashlane/session-contracts";
export type UsePublicUserIdOutput = {
  status: DataStatus;
  data: string | undefined;
};
export const usePublicUserId = () => {
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);
  const loginStatus = useUserLoginStatus();
  useEffect(() => {
    if (loginStatus?.loggedIn) {
      setIsUserLoggedIn(true);
    }
  }, [loginStatus?.loggedIn]);
  const { data, status } = useModuleQuery(
    sessionApi,
    "currentSessionInfo",
    undefined,
    { initialSkip: !isUserLoggedIn }
  );
  return { status, data: data?.publicUserId };
};
