import React from 'react';
import { CustomRoute, RoutesProps } from 'libs/router';
import PasswordHistory from 'webapp/password-history/password-history';
export const PasswordHistoryRoutes = ({ path }: RoutesProps) => (<CustomRoute path={[`${path}/filter/:credentialId`, path]} component={PasswordHistory}/>);
