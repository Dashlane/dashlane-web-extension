import React from "react";
interface SideNavNotificationContextInterface {
  hasNewBreaches: boolean;
  setHasNewBreaches: (hasNewBreaches: boolean) => void;
}
export const SideNavNotificationContext =
  React.createContext<SideNavNotificationContextInterface | null>(null);
export const SideNavNotificationProvider = ({
  children,
}: React.PropsWithChildren<Record<never, never>>) => {
  const [hasNewBreaches, setHasNewBreaches] = React.useState<boolean>(false);
  return (
    <SideNavNotificationContext.Provider
      value={{ hasNewBreaches, setHasNewBreaches }}
    >
      {children}
    </SideNavNotificationContext.Provider>
  );
};
