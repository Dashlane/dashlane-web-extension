import React, { createContext, ReactNode, useContext } from 'react';
import { PremiumStatusSpaceItemView } from '@dashlane/communication';
import { DataStatus } from '@dashlane/framework-react';
import { useSpaces } from 'src/libs/api';
interface Context {
    getSpace: (spaceId: string) => PremiumStatusSpaceItemView | null;
}
interface Provider {
    children: ReactNode;
}
const SpacesContext = createContext<Context>({} as Context);
const SpacesProvider = ({ children }: Provider) => {
    let spaces: PremiumStatusSpaceItemView[] | null = null;
    const spacesQuery = useSpaces();
    if (spacesQuery.status === DataStatus.Success) {
        spaces = spacesQuery.data;
    }
    const contextValue = {
        getSpace: (spaceId: string) => spaces?.find((space) => space.spaceId === spaceId) ?? null,
    };
    return (<SpacesContext.Provider value={contextValue}>
      {children}
    </SpacesContext.Provider>);
};
const useSpacesContext = () => useContext(SpacesContext);
export { SpacesProvider, useSpacesContext };
