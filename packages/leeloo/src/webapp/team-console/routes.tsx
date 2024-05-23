import * as React from 'react';
import { Redirect, RoutesProps } from 'libs/router';
import { RoutingSchemeOptions, TAC_URL } from 'app/routes/constants';
import { isAllAppsRouting } from 'app/routes/helpers';
import TeamRoutes from 'team/routes';
import { TacTabs } from 'team/types';
interface Props extends RoutesProps {
    routingSchemeOptions: RoutingSchemeOptions;
}
export default function routes({ path, routingSchemeOptions, }: Props): JSX.Element {
    if (!APP_PACKAGED_IN_EXTENSION && !isAllAppsRouting(routingSchemeOptions)) {
        return <Redirect to={TAC_URL}/>;
    }
    return (<TeamRoutes basePath={path} path={[
            path,
            `${path}/${TacTabs.ACCOUNT}`,
            `${path}/${TacTabs.ACTIVITY}`,
            `${path}/${TacTabs.DASHBOARD}`,
            `${path}/${TacTabs.GROUPS}`,
            `${path}/${TacTabs.MEMBERS}`,
            `${path}/${TacTabs.SETTINGS}`,
            `${path}/${TacTabs.DARK_WEB_INSIGHTS}`,
        ]}/>);
}
