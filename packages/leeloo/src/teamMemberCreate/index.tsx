import * as React from 'react';
import { RoutesProps } from 'libs/router';
import AccountCreationRoutes from 'account/creation/routes';
const teamMemberCreateRoutes = ({ path }: RoutesProps): JSX.Element => (<AccountCreationRoutes path={`${path}/create`} options={{ flowIndicator: 'teamTrial' }}/>);
export default teamMemberCreateRoutes;
