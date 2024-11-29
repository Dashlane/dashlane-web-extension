import { CustomRoute, Route, RoutesProps } from "../libs/router";
import { AlreadyLoggedInRedirection } from "../auth/already-logged-in-redirection";
import { AccountCreation } from "./account-creation";
export const AccountCreationRoutes = ({
  path,
}: Omit<RoutesProps<string[]>, "basePath">) => {
  return (
    <Route path={path}>
      <CustomRoute component={AlreadyLoggedInRedirection} path={path} />

      <CustomRoute path={path} component={AccountCreation} />
    </Route>
  );
};
