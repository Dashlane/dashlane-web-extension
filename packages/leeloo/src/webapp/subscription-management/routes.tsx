import { CustomRoute, RoutesProps } from "../../libs/router";
import { SubscriptionPageWrapper } from "./subscription-page/subscription-page-wrapper";
export const SubscriptionManagementRoutes = ({ path }: RoutesProps) => {
  return <CustomRoute path={path} component={SubscriptionPageWrapper} />;
};
