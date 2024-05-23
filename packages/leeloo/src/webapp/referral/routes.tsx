import { jsx } from '@dashlane/design-system';
import { CustomRoute, RoutesProps } from 'libs/router';
import { Referral } from './referral';
export const ReferralRoutes = ({ path }: RoutesProps) => {
    return <CustomRoute path={path} component={Referral}/>;
};
