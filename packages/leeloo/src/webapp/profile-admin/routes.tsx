import { CustomRoute, RoutesProps } from "../../libs/router";
import { ProfileAdmin } from "./profile-admin";
export const ProfileAdminRoutes = ({ path }: RoutesProps) => {
  return <CustomRoute exact path={`${path}`} component={ProfileAdmin} />;
};
