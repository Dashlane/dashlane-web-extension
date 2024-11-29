import * as React from "react";
import { Redirect, RoutesProps, useLocation } from "../../router";
export const NewItem = (props: RoutesProps) => {
  const location = useLocation();
  const url = `${location.pathname}${location.search}`;
  const redirectUrl = url.replace("/new", "/add");
  return url !== redirectUrl ? <Redirect to={redirectUrl} /> : null;
};
