import React from "react";
import { CustomRoute, RoutesProps } from "../../libs/router";
import { SecureNotes } from "./secure-notes";
export const SecureNotesRoutes = ({ path }: RoutesProps): JSX.Element => (
  <CustomRoute path={path} component={SecureNotes} />
);
