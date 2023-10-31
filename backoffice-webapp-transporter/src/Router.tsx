import "primeflex/primeflex.css";

import React from "react";
import { Switch} from "react-router";

import {LoginPage, NotFoundPage} from "./pages";
import DriversManagment from "./pages/DriversManagment";
import PrivateRoute from "./guards/PrivateRoute";

function Router() {
    return (
        <>
            <Switch>
                <PrivateRoute loginPage={true} exact path="/" component={LoginPage}/>
                <PrivateRoute
                    loginPage={false}
                    exact
                    path="/drivers-managment"
                    component={DriversManagment}
                />
                <PrivateRoute loginPage={false} component={NotFoundPage}/>
            </Switch>
        </>
    );
}

export default Router;
