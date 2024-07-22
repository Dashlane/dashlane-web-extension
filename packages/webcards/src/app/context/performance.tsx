import * as React from "react";
export type TimeToWebcard = number;
export const PerformanceContext = React.createContext<
  TimeToWebcard | null | undefined
>(undefined);
export const PerformanceContextProvider = ({
  children,
  timeToWebcard,
}: {
  children: React.ReactNode;
  timeToWebcard: TimeToWebcard | null;
}) => {
  return (
    <PerformanceContext.Provider value={timeToWebcard}>
      {children}
    </PerformanceContext.Provider>
  );
};
export const usePerformanceContext = () => {
  const context = React.useContext(PerformanceContext);
  if (context === undefined) {
    throw new Error("usePerformanceContext was used outside of its Provider");
  }
  return context;
};
