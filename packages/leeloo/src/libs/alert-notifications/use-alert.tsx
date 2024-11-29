import { useContext } from "react";
import { AlertContext } from "./alert-provider";
export const useAlert = () => {
  return useContext(AlertContext);
};
