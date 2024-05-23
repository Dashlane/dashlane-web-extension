import * as React from 'react';
import { CustomRoute, Redirect, RoutesProps, Switch, WrappingRoute, } from 'libs/router';
import RecentActivity from './recent';
import RequestsActivity from './requests';
import requestsActivityReducer from './requests/reducer';
import { withNavLayout } from 'team/page/nav-layout/with-nav-layout';
const RecentActivityWithNav = withNavLayout(RecentActivity, 'activity');
const RequestsActivityComponent = withNavLayout(RequestsActivity, 'activity');
export default function routes({ path }: RoutesProps): JSX.Element {
    return (<WrappingRoute path={[path, `${path}/recent`, `${path}/requests`]} permission={(p) => p.adminAccess.hasFullAccess}>
      <Switch>
        <Redirect exact from={`${path}/`} to={`${path}/recent`}/>
        <CustomRoute path={`${path}/requests`} component={RequestsActivityComponent} reducer={requestsActivityReducer}/>
        <CustomRoute path={`${path}/recent`} component={RecentActivityWithNav}/>
      </Switch>
    </WrappingRoute>);
}
