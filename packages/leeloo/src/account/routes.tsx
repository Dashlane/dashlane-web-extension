import * as React from 'react';
import { Redirect, RoutesProps, Switch, WrappingRoute } from 'libs/router';
import { Indicator } from './creation/flow';
import AccountCreationRoutes from './creation/routes';
import Account from '.';
export default function routes({ path, options = { flowIndicator: 'webAccount' }, }: RoutesProps<string, {
    flowIndicator: Indicator;
}>): JSX.Element {
    return (<WrappingRoute exact path={[path, `${path}/create`, `${path}/create/confirm`]} component={Account}>
      <Switch>
        <Redirect exact from={`${path}/`} to={`${path}/create`}/>
        <AccountCreationRoutes path={`${path}/create`} options={options}/>
      </Switch>
    </WrappingRoute>);
}
