import React from "react";
import { AnimationProps } from "./animation";
const Animation = React.lazy(() => import("./animation"));
export type LazyAnimationProps = AnimationProps & {
  loadingComp: NonNullable<React.ReactNode> | null;
};
const LazyAnimation = (props: LazyAnimationProps) => {
  const { loadingComp, ...animationProps } = props;
  return (
    <React.Suspense fallback={props.loadingComp}>
      <Animation {...animationProps} />
    </React.Suspense>
  );
};
export default LazyAnimation;
