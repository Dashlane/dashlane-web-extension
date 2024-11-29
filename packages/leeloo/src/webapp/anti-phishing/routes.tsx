import { CustomRoute, RoutesProps } from "../../libs/router";
import { AntiPhishing } from "./anti-phishing";
export const AntiPhishingRoutes = ({ path }: RoutesProps) => {
  return <CustomRoute path={path} component={AntiPhishing} />;
};
