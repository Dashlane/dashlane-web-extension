import React from "react";
import { SkeletonSideMenu } from "./skeleton-side-menu";
import { SkeletonCredentialsView } from "./skeleton-credentials-view";
export const SkeletonVault = () => {
  return (
    <div
      style={{
        height: "100vh",
        whiteSpace: "nowrap",
      }}
    >
      <SkeletonSideMenu />
      <SkeletonCredentialsView />
    </div>
  );
};
