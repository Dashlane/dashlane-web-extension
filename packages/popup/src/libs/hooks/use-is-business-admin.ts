import { DataStatus } from "@dashlane/framework-react";
import { isAccountBusinessAdmin } from "../../app/helpers";
import { usePremiumStatusData } from "../api";
export const useIsBusinessAdmin = (): boolean => {
  const premiumStatusQuery = usePremiumStatusData();
  const isBusinessAdmin =
    premiumStatusQuery.status === DataStatus.Success &&
    isAccountBusinessAdmin(premiumStatusQuery.data);
  return isBusinessAdmin;
};
