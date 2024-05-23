import React, { ReactNode, useContext } from 'react';
import { useListenToLogPageViews } from './logEvent';
interface Provider {
    children: ReactNode;
}
const LogPageViewContext = React.createContext<string>('');
const LogPageViewProvider = ({ children }: Provider) => {
    const currentPageView = useListenToLogPageViews();
    return (<LogPageViewContext.Provider value={currentPageView}>
      {children}
    </LogPageViewContext.Provider>);
};
const useLogPageViewContext = () => useContext(LogPageViewContext);
export { LogPageViewProvider, useLogPageViewContext };
