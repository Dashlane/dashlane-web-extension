import * as React from 'react';
import { Redirect, RoutesProps, Switch, WrappingRoute } from 'libs/router';
import AccountCreationRoutes from 'account/creation/routes';
export default function routes({ path }: RoutesProps): JSX.Element {
    return (<WrappingRoute exact path={[path, `${path}/create`, `${path}/create/confirm`]}>
      <Switch>
        <Redirect exact from={`${path}/`} to={`${path}/create`}/>
        <AccountCreationRoutes path={`${path}/create`} options={{
            flowIndicator: 'memberAccount',
        }}/>
      </Switch>
    </WrappingRoute>);
}
