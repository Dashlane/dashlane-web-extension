import * as React from "react";
import { render } from "react-dom";
import { PlaygroundRoot } from "./app/components/playground/PlaygroundRoot";
import initUtils from "./app/utils";
import "./index.scss";
document.addEventListener("DOMContentLoaded", () => {
  import("./app/App.js").then(({ App }) => {
    const utils = initUtils();
    const appRoot = <App utils={utils} />;
    const renderApp = (root: JSX.Element) =>
      render(root, document.getElementById("ractive-container"));
    if (!utils.env.__REDACTED__ && !utils.env.isDevBuild) {
      renderApp(<PlaygroundRoot utils={utils}>{appRoot}</PlaygroundRoot>);
    } else {
      renderApp(appRoot);
    }
  });
});
