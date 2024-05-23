import React from 'react';
import { CustomRoute, RoutesProps } from 'libs/router';
import { Secrets } from 'webapp/secrets/secrets';
export const SecretsRoutes = ({ path }: RoutesProps): JSX.Element => (<CustomRoute path={path} component={Secrets}/>);
