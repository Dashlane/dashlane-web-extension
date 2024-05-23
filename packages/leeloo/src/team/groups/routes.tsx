import * as React from 'react';
import { CustomRoute, RoutesProps, Switch, WrappingRoute } from 'libs/router';
import Container from './container';
import { Connected as Edit } from './edit/connected';
import editReducer from './edit/reducer';
import { Connected as List } from './list/connected';
import listReducer from './list/reducer';
import { withNavLayout } from 'team/page/nav-layout/with-nav-layout';
import { TacTabs } from 'team/types';
interface Props extends RoutesProps {
    permission: (p: any) => boolean;
}
const ListWithNavLayout = withNavLayout(List, TacTabs.GROUPS);
const EditWithNavLayout = withNavLayout(Edit, TacTabs.GROUPS);
export default function routes(props: Props): JSX.Element {
    const { path, permission } = props;
    return (<WrappingRoute exact path={[path, `${path}/:uuid`]} component={Container} permission={permission}>
      <Switch>
        <CustomRoute exact path={path} component={ListWithNavLayout} reducer={listReducer}/>
        <CustomRoute path={`${path}/:uuid`} component={EditWithNavLayout} reducer={editReducer}/>
      </Switch>
    </WrappingRoute>);
}
