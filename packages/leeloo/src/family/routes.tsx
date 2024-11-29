import { CustomRoute, Redirect, RoutesProps, Switch } from "../libs/router";
import { JoinFamilyContainer } from "./container/container";
export default function routes({ path }: RoutesProps): JSX.Element {
  const joinFamilyPath = `${path}/join`;
  return (
    <Switch>
      <Redirect exact from={`${path}/`} to={joinFamilyPath} />
      <CustomRoute
        exact
        path={[
          joinFamilyPath,
          `${joinFamilyPath}/confirm`,
          `${joinFamilyPath}/failed`,
        ]}
        component={JoinFamilyContainer}
        additionalProps={{ basePath: joinFamilyPath }}
      />
    </Switch>
  );
}
