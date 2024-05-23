import React from 'react';
import { useSideMenuCollapsedContext } from 'webapp/sidemenu/side-menu-collapsed-context';
import variables from 'webapp/variables.css';
export function useIsHeaderWidthAboveSize(width: number) {
    const [isHeaderWidthAboveSize, setIsHeaderWidthAboveSize] = React.useState(true);
    const { isSideMenuCollapsed } = useSideMenuCollapsedContext();
    React.useEffect(() => {
        const handleResize = () => {
            const sideMenuVariable = isSideMenuCollapsed
                ? variables['--sidemenu-collapsed-width']
                : variables['--sidemenu-uncollapsed-min-width'];
            const sideMenuWidth = parseInt(sideMenuVariable, 10);
            if (window.innerWidth - sideMenuWidth < width) {
                setIsHeaderWidthAboveSize(false);
            }
            else {
                setIsHeaderWidthAboveSize(true);
            }
        };
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [width, isSideMenuCollapsed]);
    return isHeaderWidthAboveSize;
}
