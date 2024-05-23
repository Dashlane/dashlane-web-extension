import * as React from 'react';
import { CustomRoute, Redirect } from 'libs/router';
import AccountRoutes from 'account/routes';
import { Dependencies } from 'dependencies/dependencies';
import MemberRoutes from 'member/routes';
import FamilyRoutes from 'family/routes';
import TeamMemberCreate from 'teamMemberCreate';
import { RootSwitch } from './routes-common';
import { DEPENDENCIES_URL_SEGMENT, FAMILY_URL_SEGMENT, MEMBER_URL_SEGMENT, WAC_TAC_URL_SEGMENT, WAC_URL_SEGMENT, } from './constants';
export const getWacRoutes = (): JSX.Element => {
    return (<RootSwitch>
      
      <Redirect exact from="/" to="/account"/>
      <Redirect exact from={WAC_TAC_URL_SEGMENT} to={`${WAC_TAC_URL_SEGMENT}/create`}/>
      
      <AccountRoutes path={WAC_URL_SEGMENT}/>
      <MemberRoutes path={MEMBER_URL_SEGMENT}/>
      <TeamMemberCreate path={WAC_TAC_URL_SEGMENT}/>
      <FamilyRoutes path={FAMILY_URL_SEGMENT}/>
      <CustomRoute path={DEPENDENCIES_URL_SEGMENT} component={Dependencies}/>
    </RootSwitch>);
};
