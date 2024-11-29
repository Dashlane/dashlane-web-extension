import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useContext,
  useMemo,
  useState,
} from "react";
import { BillingDetails } from "../add-seats/add-seats-wrapper";
import { CostDetailsForTier } from "../add-seats/teamPlanCalculator";
import { GetPlanPricingDetailsResult } from "@dashlane/team-admin-contracts";
type UpsellDetails = {
  lastBillingDetails: BillingDetails | GetPlanPricingDetailsResult | undefined;
  lastAdditionalSeatsDetails: CostDetailsForTier[] | undefined;
};
interface Context {
  isAddSeatsSuccessOpen: boolean;
  setIsAddSeatsSuccessPageOpen: (value: boolean) => void;
  setSeatDetails: Dispatch<SetStateAction<UpsellDetails>>;
  upsellDetails: {
    lastBillingDetails:
      | BillingDetails
      | GetPlanPricingDetailsResult
      | undefined;
    lastAdditionalSeatsDetails: CostDetailsForTier[] | undefined;
  };
}
interface Provider {
  children: ReactNode;
}
const AddSeatsSuccessContext = createContext<Context>({} as Context);
const AddSeatsSuccessProvider = ({ children }: Provider) => {
  const [isAddSeatsSuccessOpen, setAddSeatsSuccessOpen] = useState(false);
  const [upsellDetails, setUpsellDetails] = useState<UpsellDetails>({
    lastBillingDetails: undefined,
    lastAdditionalSeatsDetails: undefined,
  });
  const contextValue = useMemo(
    () => ({
      isAddSeatsSuccessOpen,
      setIsAddSeatsSuccessPageOpen: setAddSeatsSuccessOpen,
      setSeatDetails: setUpsellDetails,
      upsellDetails,
    }),
    [isAddSeatsSuccessOpen, upsellDetails]
  );
  return (
    <AddSeatsSuccessContext.Provider value={contextValue}>
      {children}
    </AddSeatsSuccessContext.Provider>
  );
};
const useAddSeatsSuccessContext = () => useContext(AddSeatsSuccessContext);
export { AddSeatsSuccessProvider, useAddSeatsSuccessContext };
