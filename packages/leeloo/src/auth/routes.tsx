import { CustomRoute, Route, RoutesProps } from "../libs/router";
import {
  LOGIN_TAC_URL_SEGMENT,
  LOGIN_URL_SEGMENT,
} from "../app/routes/constants";
import { Auth, AuthOptions } from "./auth";
import LoginPanel from "./login-panel/login-panel-proxy";
import { AlreadyLoggedInRedirection } from "./already-logged-in-redirection";
const Routes = ({
  options,
  path,
}: Omit<RoutesProps<string[], AuthOptions>, "basePath">) => {
  return (
    <Route path={path}>
      <CustomRoute component={AlreadyLoggedInRedirection} path={path} />
      <Auth options={options}>
        <CustomRoute
          path={[LOGIN_URL_SEGMENT, LOGIN_TAC_URL_SEGMENT]}
          options={options}
          component={LoginPanel}
        />
      </Auth>
    </Route>
  );
};
export default Routes;
