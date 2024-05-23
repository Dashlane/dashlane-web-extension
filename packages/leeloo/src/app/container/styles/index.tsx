import * as React from 'react';
import './base.css';
import { AppThemeProvider } from './AppThemeProvider';
const AppStyles = (props: React.PropsWithChildren<unknown>) => (<AppThemeProvider>
    <div>{React.Children.only(props.children)}</div>
  </AppThemeProvider>);
export default AppStyles;
