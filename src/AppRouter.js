import React from "react";
import { Route, Switch } from "react-router-dom";
import Template from "./modules/template/Template";

function AppRouter() {
  return (
      <Switch>
        <Route exact path="/" component={Template} />
      </Switch>
  );
}

export default AppRouter;
