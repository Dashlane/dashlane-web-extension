import { lazy, Suspense } from "react";
import { CustomRoute, RoutesProps } from "../../libs/router";
const CollectionView = lazy(() =>
  import("./collection-view").then((module) => ({
    default: module.CollectionView,
  }))
);
const CollectionsOverview = lazy(() =>
  import("./collections-overview").then((module) => ({
    default: module.CollectionsOverview,
  }))
);
export const CollectionsRoutes = ({ path }: RoutesProps): JSX.Element => (
  <Suspense fallback={null}>
    <CustomRoute exact path={path} component={CollectionsOverview} />
    <CustomRoute path={`${path}/:collectionId`} component={CollectionView} />
  </Suspense>
);
