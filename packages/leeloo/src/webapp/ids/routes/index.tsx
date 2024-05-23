import React from 'react';
import { CustomRoute, RoutesProps } from 'libs/router';
import { Ids } from 'webapp/ids/ids';
export const IdsRoutes = ({ path }: RoutesProps) => (<CustomRoute path={path} component={Ids}/>);
